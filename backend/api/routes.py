from flask import request
from flask import Flask, jsonify
from flask_cors import CORS
from firebase import db
from users.users import users
from chats.chats import chats
from analyses.analyses import analyses


app = Flask(__name__)
CORS(app)


app.register_blueprint(users, url_prefix='/api/users')
app.register_blueprint(chats, url_prefix='/api/chats')
app.register_blueprint(analyses, url_prefix='/api/analyses')


if __name__ == '__main__':
    app.run(debug=True)
