import os

# Base directory of the backend folder
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Secret key for JWT tokens — change this in production!
    SECRET_KEY = os.environ.get('SECRET_KEY', 'flashlearn-secret-key-2024')
    
    # JWT secret key
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'flashlearn-jwt-secret-2024')
    
    # SQLite database stored in the database/ folder
    SQLALCHEMY_DATABASE_URI = 'sqlite:///' + os.path.join(BASE_DIR, '..', 'database', 'flashlearn.db')
    
    # Disable modification tracking to save memory
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Allow JWT in headers
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
