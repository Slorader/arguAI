from flask import Flask, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)
CORS(app)

cred = credentials.Certificate("../firebase_credentials.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': 'Data retrieved successfully'}
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
