from flask import Blueprint, request, jsonify
from firebase import db
import spacy
import nltk
import string
import joblib
import os
import uuid
import json
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, AutoConfig
import torch
from safetensors.torch import load_file
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer


classification_model_path = os.path.join("../train/classification/models", "random_forest_model.pkl")
vectorizer_path = os.path.join("../train/classification/models", "tfidf_vectorizer.pkl")

classification_model = joblib.load(classification_model_path)
vectorizer = joblib.load(vectorizer_path)

tokenizer_path = "../train/relations/models"
model_weights_path = "../train/relations/models/model.safetensors"
config_path = "../train/relations/models/config.json"

tokenizer = DistilBertTokenizer.from_pretrained(tokenizer_path)
config = AutoConfig.from_pretrained(config_path)
relation_model = DistilBertForSequenceClassification(config)

state_dict = load_file(model_weights_path)
relation_model.load_state_dict(state_dict)

nlp = spacy.load("en_core_web_sm")

conclusion_keywords = [
    'so', 'therefore', 'thus', 'then', 'consequently', 'hence', 'accordingly',
    'as a result', 'as such', 'henceforth', 'henceforward', 'subsequently'
]

def preprocess_text(text):
    text = text.lower()
    text = text.translate(str.maketrans('', '', string.punctuation))
    tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_tokens = [word for word in tokens if word not in stop_words]
    lemmatizer = WordNetLemmatizer()
    lemmatized_tokens = [lemmatizer.lemmatize(word) for word in filtered_tokens]
    preprocessed_text = ' '.join(lemmatized_tokens)
    return preprocessed_text

def predict_category(text):
    preprocessed_text = preprocess_text(text)
    X = vectorizer.transform([preprocessed_text])
    prediction = classification_model.predict(X)

    if prediction[0] != 'conclusion':
        if any(text.lower().startswith(keyword + ' ') or text.lower().startswith(keyword + ',') for keyword in conclusion_keywords):
            return 'conclusion'

    return prediction[0]

def segment_text(doc):
    segments = []
    start = 0
    include_next = False

    continuation_keywords = [
        'so', 'therefore', 'thus', 'then', 'consequently', 'hence', 'accordingly', 'in conclusion',
        'as a result', 'because', 'as such', 'henceforth', 'henceforward', 'subsequently'
    ]

    for token in doc:
        if token.text in ('.', '?', '!', ';') or token.is_space:
            segments.append(doc[start:token.i + 1].text.strip())
            start = token.i + 1
            include_next = False
        elif token.text in continuation_keywords:
            segments.append(doc[start:token.i].text.strip())
            start = token.i
            include_next = True
        elif token.text == ',' and include_next:
            include_next = False

    if start < len(doc):
        segments.append(doc[start:].text.strip())

    return segments

def predict_relation(text1, text2):
    inputs = tokenizer(text1, text2, return_tensors="pt", truncation=True, padding=True, max_length=128)
    outputs = relation_model(**inputs)
    logits = outputs.logits
    prediction = torch.argmax(logits, dim=1).item()
    return prediction == 1

def create_json_output(sentences, predictions):
    nodes = []
    edges = []

    for sentence, prediction in zip(sentences, predictions):
        node_id = str(uuid.uuid4())
        nodes.append({
            "id": node_id,
            "text": sentence,
            "type": prediction
        })

    for i in range(len(nodes)):
        for j in range(len(nodes)):
            if i != j:
                type1 = nodes[i]['type']
                type2 = nodes[j]['type']
                if (type1 == 'premise' and type2 in ['sub-conclusion', 'conclusion']) or (type1 == 'sub-conclusion' and type2 in ['sub-conclusion', 'conclusion']):
                    if predict_relation(nodes[i]['text'], nodes[j]['text']):
                        edges.append({
                            "text_source": nodes[i]['text'],
                            "text_target": nodes[j]['text'],
                            "type": "support"
                        })

    output = {
        "nodes": nodes,
        "edges": edges
    }

    return json.dumps(output, indent=4)

analyses = Blueprint('analyses', __name__)

@analyses.route('/', methods=['POST'])
def call_analyses():
    data = request.json
    text = data.get('message')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    doc = nlp(text)
    sentences = segment_text(doc)
    sentences = [sentence for sentence in sentences if sentence.strip() != '']

    predictions = [predict_category(sentence) for sentence in sentences]

    output_json = create_json_output(sentences, predictions)
    print('ICI')
    print(sentences, predictions)
    return jsonify(json.loads(output_json))

@analyses.route('/add/<chat_id>', methods=['POST'])
def add_analysis(chat_id):
    data = request.json
    analysis_ref = db.collection('Analyses').document()
    analysis_ref.set({'chat_id': chat_id})

    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    for node in nodes:
        db.collection('Nodes').add({
            'analyse_id': analysis_ref.id,
            'text': node['text'],
            'type': node['type']
        })

    for edge in edges:
        db.collection('Edges').add({
            'analyse_id': analysis_ref.id,
            'text_source_id': edge['text_source'],
            'text_target_id': edge['text_target'],
            'type': edge['type']
        })

    return jsonify({"status": "success", "analysis_id": analysis_ref.id})

@analyses.route('/get/<chat_id>', methods=['GET'])
def get_analysis(chat_id):
    try:
        analysis_query = db.collection('Analyses').where('chat_id', '==', chat_id).stream()
        analysis_id = None
        for analysis in analysis_query:
            analysis_id = analysis.id
            break

        if not analysis_id:
            return jsonify({"error": "Analysis not found"}), 404

        nodes_query = db.collection('Nodes').where('analyse_id', '==', analysis_id).stream()
        nodes = []
        for node in nodes_query:
            nodes.append(node.to_dict())

        edges_query = db.collection('Edges').where('analyse_id', '==', analysis_id).stream()
        edges = []
        for edge in edges_query:
            edges.append(edge.to_dict())

        response_data = {
            'analysis_id': analysis_id,
            'chat_id': chat_id,
            'nodes': nodes,
            'edges': edges
        }

        return jsonify(response_data)

    except Exception as e:
        print(f"Error retrieving analysis: {e}")
        return jsonify({"status": "error", "message": "Error retrieving analysis"}), 500
