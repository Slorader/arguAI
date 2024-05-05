from flask import Blueprint, request, jsonify
from firebase import db

users = Blueprint('users', __name__)
@users.route('/register', methods=['POST'])
def register():
    user_data = request.json

    name = user_data.get('name')
    last_name = user_data.get('last_name')
    email = user_data.get('email')
    password = user_data.get('password')
    confirm_password = user_data.get('confirm_password')

    return jsonify({'message': 'User registered successfully', 'user': user_data}), 201
