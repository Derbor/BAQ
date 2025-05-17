from datetime import datetime

class User:    
    def __init__(self, name=None, email=None, type=None, created_at=None, updated_at=None, subscription=False, subscription_id=None):
        self.name = name
        self.email = email
        self.type = type
        self.created_at = created_at
        self.updated_at = updated_at
        self.subscription = subscription
        self.subscription_id = subscription_id

#idCliente: pdMA2SW2XIQUFlKVMCfJtmbr1E
#claveSecreta: 95VI8Pi1LRGDIj9rWJdF3rSL46OUmVW5Jtby9aVVkgLuc60z