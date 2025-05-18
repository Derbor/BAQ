from repositories.repository import *
from datetime import datetime, timedelta
import requests

class BAQService:

    def user_exist_by_email(self, email):
        return email_exist(email)

    def create_user(self, user):
        created_at = datetime.now()
        updated_at = datetime.now()

        if user.email != None:
            exist = email_exist(user.email)
            if exist:
                return "ESTE CORREO YA ESTA SIENDO UTILIZADO", 409
            
            if user.subscription:
                subscription_id = create_subscription_query(user.type, "ACTIVE", created_at)
                user.subscription_id = subscription_id    

        result = create_user_query(user.name, user.email, created_at, updated_at, user.subscription_id)

        return "USER CREATED", result
    
    def create_transaction(self, email, amount, last_card_digits, device_footprint, transaction_ip):
        user_id = get_user_id_by_email_query(email)
        subscription_id = get_active_subscription_id_by_email_query(email)
        new_transaction_id = create_transaction_query(amount, "PAYED", user_id, subscription_id, last_card_digits, device_footprint, transaction_ip)
        
        #SEND OF EMAIL FOR TESTING PURPOSES
        emailSubject, emailBody  = get_email_template(False)
        emailData = {"emails" : [email], "subject": emailSubject, "body": emailBody}
        print(emailSubject)
        self.send_email(emailData)

        return "TRANSACTION CREATED", new_transaction_id
    
    def get_subscription_id_by_email(self, email):
        return get_subscription_id_by_email_query(email)

    def cancel_pause_user_subscription(self, email, new_subscription_state):
        return cancel_pause_subscription(email, new_subscription_state)
    
    def resume_user_subscription(self, email):      
        return resume_subscription(email, "ACTIVE")
    
    def get_email_data(self, recurrent):
        emailBody = None
        emailSubject = None
        emails = []
        if recurrent:
            date = datetime.now()
            emailSubject, emailBody = get_email_template(recurrent)
            emails = get_subscribed_emails(date)
        else:
            date = datetime.now() + timedelta(days=3)
            emailSubject, emailBody = get_email_template(recurrent)
            emails = get_not_subscribed_emails(date)
        
        if not emails:
            return None
        return {"emails" : emails, "subject": emailSubject, "body": emailBody}
    

    def create_template(self, content, name, recurrent, type):
        return create_template_command(content, name, recurrent, type)
    
    def update_template(self, template_id, content, name, recurrent):
        return update_template_command(template_id, content, name, recurrent)
    
    def get_templates(self, type):
        return get_all_message_templates_by_type(type)
    
    def send_email(self, payload):
        url = 'http://localhost:3000/correo'
        try:
            response = requests.post(url, json=payload)
            response.raise_for_status()
            print("Código de estado:", response.status_code)
        except requests.exceptions.RequestException as e:
            print("Error al enviar el correo:", e)
