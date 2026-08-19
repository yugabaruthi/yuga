from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

# These objects are created here and initialized in app.py
# This avoids circular imports between models and the app

db = SQLAlchemy()
jwt = JWTManager()
