import json
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
from collections import Counter
from imblearn.over_sampling import SMOTE
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.model_selection import GridSearchCV
import joblib

# Télécharger les ressources NLTK nécessaires
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

# Charger les données JSON
json_file_path = "../data/classification-dataset.json"

def load_data_from_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

# Prétraiter le texte
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

# Charger et préparer les données
graph_data_list = load_data_from_json(json_file_path)

source_texts = []
target_texts = []
labels = []

for graph_data in graph_data_list:
    nodes = {node['id']: preprocess_text(node['text']) for node in graph_data.get("nodes", [])}
    edges = graph_data.get("edges", [])
    for edge in edges:
        source_id = edge.get('source_id')
        target_id = edge.get('target_id')
        relation_type = edge.get('type')
        if source_id in nodes and target_id in nodes:
            source_texts.append(nodes[source_id])
            target_texts.append(nodes[target_id])
            labels.append(relation_type)

# Fusionner les textes source et cible pour la vectorisation
combined_texts = [f"{source} {target}" for source, target in zip(source_texts, target_texts)]

# Afficher la distribution des classes
print(f"Original class distribution: {Counter(labels)}")

# Vectorisation avec TF-IDF
vectorizer = TfidfVectorizer(max_features=5000)
X = vectorizer.fit_transform(combined_texts)
y = labels

# Équilibrer les classes avec SMOTE si nécessaire
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

# Séparer les données en ensembles d'entraînement et de test
X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

# Entraîner le modèle
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Évaluer le modèle
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred, target_names=list(set(labels))))

# Sauvegarder le modèle et le vectorizer
model_path = "./models/segment_relation_classifier.pkl"
vectorizer_path = "./models/tfidf_vectorizer.pkl"
joblib.dump(clf, model_path)
joblib.dump(vectorizer, vectorizer_path)

print(f"Model saved to {model_path}")
print(f"Vectorizer saved to {vectorizer_path}")
