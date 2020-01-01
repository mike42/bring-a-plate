from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from .config import config

# Import apidoc for monkey patching
from flask_restplus.apidoc import apidoc
apidoc.url_prefix = '/api'


db = SQLAlchemy()
flask_bcrypt = Bcrypt()


def create_app():
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    flask_bcrypt.init_app(app)
    return app
