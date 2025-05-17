from repositories.repository import *
from datetime import datetime

class BAQService:
    def create_user(self, user):
        created_at = datetime.now()
        updated_at = datetime.now()

        if user.email != None:
            exist = email_exist(user.email)
            if exist:
                return "RESULTADO INCORRECTO", 400
    
        if user.subscription:
            print("SI ESTA INGRESANDO")
            subscription_id = create_subscription_query(user.type, "ACTIVE", created_at)
            user.subscription_id = subscription_id

        resultado = create_user_query(user.name, user.email, created_at, updated_at, user.subscription_id)
        return "RESULTADO SERVICIO", resultado