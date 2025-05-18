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
    last_card_digits = data.get("last_card_digits", "")
    device_footprint = data.get("device_footprint", "")
    transaction_ip = data.get("transaction_ip", "")

    if amount < 1:
        return jsonify({'ERROR': 'Donations must have to be greater than $1 dollar'}), 400

    serviceResponse = baqService.create_transaction(email, amount, last_card_digits, device_footprint, transaction_ip)
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


@app.route('/mails', methods=['POST'])
def get_emails_by_category():
    data = request.json
    recurrent = data.get("recurrent", None)

    serviceResponse = baqService.get_email_data(recurrent)
    return jsonify(serviceResponse), 200

@app.route('/create-template', methods=['POST'])
def create_template():
    data = request.json
    type = data.get("type")
    content = data.get("content", "")
    name = data.get("name", "")
    recurrent = data.get("recurrent", False)

    serviceResponse = baqService.create_template(content, name, recurrent, type)
    return jsonify(serviceResponse), 200

@app.route('/edit-template', methods=['PUT'])
def edit_template():
    data = request.json
    template_id = data.get("id", None)
    content = data.get("content", "")
    name = data.get("name", "")
    recurrent = data.get("recurrent", False)

    if template_id is None:
        return jsonify({"Error" : "ESTE TEMPLATE NO EXISTE"}), 400

    serviceResponse = baqService.update_template(template_id, content, name, recurrent)
    return jsonify(serviceResponse), 200

@app.route('/get-all-templates', methods=['GET'])
def get_all_templates():
    type = request.args.get("type", None)

    if type is None:
        return jsonify({"Error" : "NO TEMPLATE TYPE WAS PROVIDEN"}), 400
    
    serviceResponse = baqService.get_templates(type)
    return jsonify(serviceResponse), 200