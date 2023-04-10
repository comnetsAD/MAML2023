

import os
from datetime import timedelta
import pymysql

BASE_DIR = os.path.dirname(os.path.realpath(__file__))


class BaseConfig():
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root:password@localhost:3306/new_maml'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "Godisking"
    JWT_SECRET_KEY = "Godisking"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1000)
