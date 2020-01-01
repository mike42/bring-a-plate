import os
import random
import string

# ?
basedir = os.path.abspath(os.path.dirname(__file__))


class Config:
    # Default to something approximately random
    SECRET_KEY = os.getenv('SECRET_KEY', ''.join(random.choices(string.ascii_uppercase + string.digits, k=20)))
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + basedir + '/../../bring_a_plate.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    DEBUG = False


config = Config
