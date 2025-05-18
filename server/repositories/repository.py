from database.DBConnection import postgresql_connection
import hashlib, uuid
from datetime import datetime

def email_exist(email):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT * FROM users WHERE email = %s LIMIT 1;
                """,
                (email,)
            )
            user = cursor.fetchone()
        connection.close()
        return user
    except Exception as e:
        print("Error checking if user exists:", e)
        return None


def create_user_query(name, email, created_at, updated_at, subscription_id):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (name, email, created_at, updated_at, subscription_id)
                VALUES (%s, %s, %s, %s, %s)
                """,
                (name, email, created_at, updated_at, subscription_id,)
            )
        connection.commit()
        connection.close()
        return 200
    except Exception as e:
        return None


def create_subscription_query(type, status, created_at):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO subscriptions (type, status, created_at)
                VALUES (%s, %s, %s)
                RETURNING id;
                """,
                (type, status, created_at)
            )
            new_id = cursor.fetchone()[0]
        connection.commit()
        connection.close()
        return new_id
    except Exception as e:
        print("Error creating subscription:", e)
        return None


def create_transaction_query(amount, status, user_id, subscription_id=None):
    try:
        connection = postgresql_connection()
        new_transaction_id = None
        with connection.cursor() as cursor:
            created_at = datetime.now()
            cursor.execute(
                """
                INSERT INTO transactions (user_id, amount, status, subscription_id, created_at)
                VALUES (%s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (user_id, amount, status, subscription_id, created_at)
            )
            new_transaction_id = cursor.fetchone()[0]

            if new_transaction_id is not None and subscription_id is not None:
                last_donation_at = datetime.now()
                cursor.execute(
                    """
                    UPDATE subscriptions
                    SET last_donation_at = %s
                    WHERE id = %s
                    """,
                    (last_donation_at, subscription_id)
                )

        connection.commit()
        connection.close()
        return new_transaction_id

    except Exception as e:
        print("Error creating transaction:", e)
        return None


def get_active_subscription_id_by_email_query(email):
    try:
        connection = postgresql_connection()
        subscription_id = None

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.id
                FROM subscriptions s
                JOIN users u ON u.subscription_id = s.id
                WHERE u.email = %s AND s.status = 'ACTIVE'
                """,
                (email,)
            )
            result = cursor.fetchone()
            if result:
                subscription_id = result[0]

        connection.close()
        return subscription_id
    except Exception as e:
        print("Error getting the subscription id:", e)
        return None


def get_subscription_id_by_email_query(email):
    try:
        connection = postgresql_connection()
        subscription_id = None

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT s.id
                FROM subscriptions s
                JOIN users u ON u.subscription_id = s.id
                WHERE u.email = %s AND (s.status = 'ACTIVE' OR s.status = 'PAUSED')
                """,
                (email,)
            )
            result = cursor.fetchone()
            if result:
                subscription_id = result[0]

        connection.close()
        return subscription_id
    except Exception as e:
        print("Error getting the subscription id:", e)
        return None

def get_user_id_by_email_query(email):    
    try:
        connection = postgresql_connection()
        user_id = None
        with connection.cursor() as cursor:
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                (email,)
            )
            result = cursor.fetchone()
            if result:
                user_id = result[0]

        connection.close()
        return user_id
    except Exception as e:
        print("Error getting the subscription id:", e)
        return None
    

def cancel_pause_subscription(email, status):
    try:
        print("pues si llega a donde deberia")
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE subscriptions s
                SET status = %s
                FROM users u
                WHERE u.subscription_id = s.id
                  AND u.email = %s
                """,
                (status, email,)
            )
        connection.commit()
        connection.close()
        return 200
    except Exception as e:
        print("Error canceling the user subscription:", e)
        return None
    

def resume_subscription(email, status):
    try:
        connection = postgresql_connection()
        last_donation_at = datetime.now()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE subscriptions s
                SET status = %s, last_donation_at = %s
                FROM users u
                WHERE u.subscription_id = s.id
                  AND u.email = %s
                """,
                (status, last_donation_at, email,)
            )
        connection.commit()
        connection.close()
        return 200
    except Exception as e:
        print("Error canceling the user subscription:", e)
        return None