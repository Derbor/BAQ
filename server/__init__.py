from flask import Flask
from flask_cors import CORS
from routes import baq_routes

app = Flask(__name__)

def init_app():
    CORS(app) 
    app.register_blueprint(baq_routes.app, url_prefix='/')
        
    return app