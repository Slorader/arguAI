from flask import Blueprint, request, jsonify
from firebase import db

chats = Blueprint('chats', __name__)

@chats.route('/add', methods=['POST'])
def add():
    chats_data = request.json
    print(chats_data)

    try:
        doc_ref = db.collection('Chats').add({
            'text': chats_data['message']['text'],
            'user_uid': chats_data['message']['user_uid'],
            'created': chats_data['message']['created'],
            'modified': chats_data['message']['modified']
        })

        return jsonify({'message': 'Chat registered successfully', 'chat': chats_data}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500
