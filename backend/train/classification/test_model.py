import spacy
import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import joblib
import os

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

def segment_text(text):
    doc = nlp(text)
    segments = [sent.text for sent in doc.sents]
    return segments

print("Entrez du texte à classifier (tapez 'exit' pour quitter) :")
while True:
    user_input = input("Texte : ")
    if user_input.lower() == 'exit':
        break

    sentences = segment_text(user_input)
    for sentence in sentences:
        predicted_label = predict_category(sentence)
        print(f"Phrase : {sentence}")
        print(f"Prédiction : {predicted_label}\n")

print("Fin de la classification.")
