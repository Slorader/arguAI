from flask import Blueprint, request, jsonify
from firebase import db

users = Blueprint('users', __name__)


@users.route('/modify/<user_id>', methods=['POST'])
def modify_user(user_id):
    try:
        data = request.json
        print(data)

        user_ref = db.collection('Users').document(user_id)
        user_ref.update(data)

        return jsonify({"message": f"User data updated successfully for user {user_id}"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
