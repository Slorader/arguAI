import json
import torch
from transformers import DistilBertTokenizer, DistilBertForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
from datasets import Dataset, load_metric
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
import string
import nltk

nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

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

with open('../data/classification-dataset.json', 'r') as f:
    data_list = json.load(f)

texts = []
labels = []

for data in data_list:
    nodes = {node['id']: (preprocess_text(node['text']), node['type']) for node in data['nodes']}
    for edge in data['edges']:
        source_id = edge['source_id']
        target_id = edge['target_id']
        if source_id in nodes and target_id in nodes:
            text1, type1 = nodes[source_id]
            text2, type2 = nodes[target_id]
            combined_text = f"{type1}: {text1} [SEP] {type2}: {text2}"
            label = 1 if edge['type'] == 'support' else 0  # 1 pour support, 0 pour none
            texts.append(combined_text)
            labels.append(label)
        else:
            print(f"Warning: Edge references non-existent node. Source ID: {source_id}, Target ID: {target_id}")

train_texts, test_texts, train_labels, test_labels = train_test_split(texts, labels, test_size=0.2, random_state=42)

model_name = "distilbert-base-uncased"
tokenizer = DistilBertTokenizer.from_pretrained(model_name)
model = DistilBertForSequenceClassification.from_pretrained(model_name, num_labels=2)

def preprocess_function(texts):
    return tokenizer(texts, truncation=True, padding=True, max_length=128)

train_encodings = preprocess_function(train_texts)
test_encodings = preprocess_function(test_texts)

train_dataset = Dataset.from_dict({
    'input_ids': train_encodings['input_ids'],
    'attention_mask': train_encodings['attention_mask'],
    'labels': train_labels
})
test_dataset = Dataset.from_dict({
    'input_ids': test_encodings['input_ids'],
    'attention_mask': test_encodings['attention_mask'],
    'labels': test_labels
})

metric = load_metric("accuracy")

def compute_metrics(eval_pred):
    logits, labels = eval_pred
    predictions = torch.argmax(torch.tensor(logits), dim=-1)  # Convertir logits en Tensor
    return metric.compute(predictions=predictions, references=labels)

# Définir les arguments d'entraînement
training_args = TrainingArguments(
    output_dir='./results',
    num_train_epochs=3,
    per_device_train_batch_size=8,
    per_device_eval_batch_size=8,
    warmup_steps=500,
    weight_decay=0.01,
    logging_dir='./logs',
    logging_steps=10,
    evaluation_strategy="epoch"
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=test_dataset,
    compute_metrics=compute_metrics
)

trainer.train()

eval_results = trainer.evaluate()

print(f"Accuracy: {eval_results['eval_accuracy']}")

# Sauvegarder le modèle entraîné
model.save_pretrained("models/trained_relation_model")
tokenizer.save_pretrained("models/trained_relation_model")
