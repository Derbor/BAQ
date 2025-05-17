from flask import Blueprint, request, jsonify
from services.service import BAQService
from models.user import User

app = Blueprint('baq_blueprint', __name__)
baqService = BAQService()

@app.route('/register', methods=['POST'])
def register():
    data = request.json

    user = User(
        name=data.get("name", None),
        email=data.get("email", None),
        subscription=data.get("subscription", False),
        type=data.get("type", None),
        subscription_id=data.get(None)
    )
    serviceResponse = baqService.create_user(user)
    return jsonify({'RESPONSE': serviceResponse}), 200

@app.route('/donate', methods=['POST'])
def donate():
    return jsonify({'RESPONSE': 'DATA'}), 200

@app.route('/cancel-subscription', methods=['POST'])
def cancel_subscription():
    return jsonify({'RESPONSE': 'DATA'}), 200

@app.route('/pause-subscription', methods=['POST'])
def pause_subscription():
    return jsonify({'RESPONSE': 'DATA'}), 200

@app.route('/resume-subscription', methods=['POST'])
def resume_subscription():
    return jsonify({'RESPONSE': 'DATA'}), 200