from flask import request
from flask import Flask, jsonify
from flask_cors import CORS
from firebase import db
from users.users import users


app = Flask(__name__)
CORS(app)


app.register_blueprint(users, url_prefix='/api/users')


if __name__ == '__main__':
    app.run(debug=True)
