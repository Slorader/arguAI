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

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

json_file_path = "../data/classification-dataset.json"

def load_data_from_json(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        data = json.load(file)
    return data

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

graph_data_list = load_data_from_json(json_file_path)

all_texts = []
all_labels = []

for graph_data in graph_data_list:
    nodes = graph_data.get("nodes", [])
    for node in nodes:
        if 'text' in node and 'type' in node:
            text = preprocess_text(node['text'])
            all_texts.append(text)
            all_labels.append(node['type'])

print(f"Original class distribution: {Counter(all_labels)}")



vectorizer = TfidfVectorizer()
X = vectorizer.fit_transform(all_texts)
y = all_labels

smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X, y)

print(f"Resampled class distribution: {Counter(y_resampled)}")

X_train, X_test, y_train, y_test = train_test_split(X_resampled, y_resampled, test_size=0.2, random_state=42)

param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [None, 10, 20, 30],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2, 4],
    'bootstrap': [True, False]
}

rf = RandomForestClassifier(random_state=42)
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, verbose=2)
grid_search.fit(X_train, y_train)

print("Best parameters found: ", grid_search.best_params_)
best_model = grid_search.best_estimator_

y_pred = best_model.predict(X_test)
print(classification_report(y_test, y_pred))

joblib.dump(best_model, "models/random_forest_model.pkl")
joblib.dump(vectorizer, "models/tfidf_vectorizer.pkl")


"""

Best parameters found:  {'bootstrap': False, 'max_depth': None, 'min_samples_leaf': 1, 'min_samples_split': 5, 'n_estimators': 300}
                precision    recall  f1-score   support

    conclusion       0.96      0.94      0.95       916
      conflict       1.00      1.00      1.00       840
       premise       0.81      0.84      0.83       844
sub-conclusion       0.83      0.82      0.82       835

      accuracy                           0.90      3435
     macro avg       0.90      0.90      0.90      3435
  weighted avg       0.90      0.90      0.90      3435


"""