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
            'modified': chats_data['message']['modified'],
            'bin': chats_data['message']['bin'],
        })

        doc_id = doc_ref[1].id

        return jsonify({'message': 'NewChat registered successfully', 'docRef_id': doc_id}), 201
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@chats.route('/<chat_id>', methods=['GET'])
def get_chat(chat_id):
    try:
        chat_doc = db.collection('Chats').document(chat_id).get()

        if chat_doc.exists:
            chat_data = chat_doc.to_dict()
            print(chat_data)
            return jsonify({'message': 'Chat retrieved successfully', 'chat': chat_data}), 200
        else:
            return jsonify({'message': 'Chat not found'}), 404
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@chats.route('/', methods=['GET'])
def get_all_chats():
    try:
        auth = request.headers.get('Authorization')
        print(auth)
        all_chats = []
        chats_collection = db.collection('Chats').get()

        for chat in chats_collection:
            chat_data = chat.to_dict()
            chat_user_uid = chat_data.get('user_uid')
            if chat_user_uid == auth:
                chat_data['id'] = chat.id
                all_chats.append(chat_data)

        return jsonify({'message': 'All chats retrieved successfully', 'chats': all_chats}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@chats.route('/delete/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    try:
        db.collection('Chats').document(chat_id).delete()

        return jsonify({'message': 'Chat deleted successfully'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500


@chats.route('/set_bin_attribute/<chat_id>', methods=['POST'])
def set_bin_attribute(chat_id):
    try:
        chat_ref = db.collection('Chats').document(chat_id)
        chat_data = chat_ref.get().to_dict()

        new_bin_value = not chat_data['bin']

        chat_ref.update({
            'bin': new_bin_value
        })

        return jsonify({"message": f"Attribute 'bin' set to {new_bin_value} successfully for chat {chat_id}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@chats.route('/bins/<user_id>', methods=['GET'])
def get_user_bin_chats(user_id):
    try:
        bin_chats = []

        chats_collection = db.collection('Chats').where('user_uid', '==', user_id).where('bin', '==', True).get()

        for chat in chats_collection:
            chat_data = chat.to_dict()
            chat_data['id'] = chat.id
            bin_chats.append(chat_data)

        return jsonify({'message': 'User bin chats retrieved successfully', 'bin_chats': bin_chats}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 500
