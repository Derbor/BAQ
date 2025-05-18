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
    return jsonify({'RESPONSE': serviceResponse[0]}), 200


@app.route('/donate', methods=['POST'])
def donate():
    data = request.json
    email = data.get("email", None)
    amount = data.get("amount", 0)

    if amount < 1:
        return jsonify({'ERROR': 'Donations must have to be greater than $1 dollar'}), 400

    serviceResponse = baqService.create_transaction(email, amount)
    return jsonify({'RESPONSE': serviceResponse[0]}), 200


@app.route('/cancel-subscription', methods=['PUT'])
def cancel_subscription():
    data = request.json
    email = data.get("email", None)

    if email is None:
        return jsonify({'ERROR': 'Email must be providen for cancel the subscription'}), 400
    
    if baqService.user_exist_by_email(email) == None:
        return jsonify({'ERROR': 'Bad email'}), 400
    
    if baqService.get_subscription_id_by_email(email) == None:
        return jsonify({'ERROR': 'There is not an active subscription related to this user'}), 400

    serviceResponse = baqService.cancel_pause_user_subscription(email, "CANCELED")

    if serviceResponse == None:
        return jsonify({'ERROR': "THE SUBSCRIPTION WAS NOT CANCELED"}), 400
    return jsonify({'RESPONSE': serviceResponse}), 200


@app.route('/pause-subscription', methods=['PUT'])
def pause_subscription():
    data = request.json
    email = data.get("email", None)

    if email is None:
        return jsonify({'ERROR': 'Email must be providen for pause the subscription'}), 400
    
    if baqService.user_exist_by_email(email) == None:
        return jsonify({'ERROR': 'Bad email'}), 400
        
    if baqService.get_subscription_id_by_email(email) == None:
        return jsonify({'ERROR': 'There is not an active subscription related to this user'}), 400

    serviceResponse = baqService.cancel_pause_user_subscription(email, "PAUSED")

    if serviceResponse == None:
        return jsonify({'ERROR': "THE SUBSCRIPTION WAS NOT PAUSED"}), 400
    return jsonify({'RESPONSE': serviceResponse}), 200


@app.route('/resume-subscription', methods=['PUT'])
def resume_subscription():
    data = request.json
    email = data.get("email", None)

    if email is None:
        return jsonify({'ERROR': 'Email must be providen for resume the subscription'}), 400

    if baqService.user_exist_by_email(email) == None:
        return jsonify({'ERROR': 'Bad email'}), 400
    
    if baqService.get_subscription_id_by_email(email) == None:
        return jsonify({'ERROR': 'There is not an active subscription related to this user'}), 400
    
    serviceResponse = baqService.resume_user_subscription(email)

    if serviceResponse == None:
        return jsonify({'ERROR': "THE SUBSCRIPTION WAS NOT RESUMED"}), 400
    return jsonify({'RESPONSE': serviceResponse}), 200