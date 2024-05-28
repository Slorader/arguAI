import spacy
import nltk
import string
import joblib
import os
import uuid
import json
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

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

model_path = os.path.join("models", "random_forest_model.pkl")
vectorizer_path = os.path.join("models", "tfidf_vectorizer.pkl")

model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)

def predict_category(text):
    preprocessed_text = preprocess_text(text)
    X = vectorizer.transform([preprocessed_text])
    prediction = model.predict(X)
    return prediction[0]

def segment_text(doc):
    segments = []
    start = 0
    include_next = False

    continuation_keywords = ['so', 'therefore', 'thus', 'then', 'consequently', 'hence', 'accordingly', 'as a result', 'because', 'as such', 'henceforth', 'henceforward', 'subsequently']

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

def create_json_output(sentences, predictions):
    nodes = []
    edges = []

    # Create nodes
    for sentence, prediction in zip(sentences, predictions):
        node_id = str(uuid.uuid4())
        nodes.append({
            "id": node_id,
            "text": sentence,
            "type": prediction
        })

    # Create edges
    for i in range(len(sentences) - 1):
        if 'so' in sentences[i + 1].lower():
            text_source = sentences[i]
            text_target = sentences[i + 1]
            edges.append({
                "text_source": text_source,
                "text_target": text_target,
                "type": "support"
            })

    output = {
        "nodes": nodes,
        "edges": edges
    }

    return json.dumps(output, indent=4)

print("Entrez du texte à classifier (classsification) (tapez 'exit' pour quitter) :")
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


"""
The RGU School of Computing is a great place to study. The staff are friendly, the labs are state-of-the-art, and the subjects are engaging. So you will have an amazing time during your degree.

Fall is the best time to visit America's great cities, beaches, and mountains. The foliage is breath-taking, the weather is cooler and the crowds are gone. So, you can really relax and enjoy yourself. 

Investing in new economic energies and adopting renewable energy is crucial for a sustainable, environmentally friendly future. Fossil fuels are finite resources that contribute to climate change. Renewable energy sources are environmentally sustainable and reduce greenhouse gas emissions, so transitioning to renewable energy is necessary to mitigate the negative environmental impact of fossil fuels.

Online education is a revolutionary way to learn. It offers flexibility, reduces commuting time, and provides access to a wide range of courses. Thus, it can accommodate diverse learning needs and schedules.

Regular exercise is essential for maintaining good health. It improves cardiovascular fitness, strengthens muscles, and boosts mental well-being. Therefore, incorporating physical activity into your daily routine is vital for a healthy lifestyle.

Reading books regularly enhances cognitive skills. It improves vocabulary, increases knowledge, and stimulates imagination. Hence, making time for reading can significantly benefit your intellectual growth.

A balanced diet is crucial for overall health. It provides essential nutrients, maintains energy levels, and prevents chronic diseases. So, eating a variety of healthy foods is important for sustaining good health.
"""