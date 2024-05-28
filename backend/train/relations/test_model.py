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

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

classification_model_path = os.path.join("../classification/models", "random_forest_model.pkl")
vectorizer_path = os.path.join("../classification/models", "tfidf_vectorizer.pkl")

classification_model = joblib.load(classification_model_path)
vectorizer = joblib.load(vectorizer_path)

tokenizer_path = "models"
model_weights_path = "models/model.safetensors"
config_path = "models/config.json"

tokenizer = DistilBertTokenizer.from_pretrained(tokenizer_path)
config = AutoConfig.from_pretrained(config_path)
relation_model = DistilBertForSequenceClassification(config)

state_dict = load_file(model_weights_path)
relation_model.load_state_dict(state_dict)

nlp = spacy.load("en_core_web_sm")

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
    return prediction[0]

def segment_text(doc):
    segments = []
    start = 0
    include_next = False

    continuation_keywords = [
        'so', 'therefore', 'thus', 'then', 'consequently', 'hence', 'accordingly',
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


print("Entrez du texte à classifier (relations) (tapez 'exit' pour quitter) :")
while True:
    user_input = input("Texte : ")
    if user_input.lower() == 'exit':
        break

    doc = nlp(user_input)
    sentences = segment_text(doc)
    predictions = [predict_category(sentence) for sentence in sentences]

    output_json = create_json_output(sentences, predictions)
    print(output_json)

print("Fin de la classification.")
