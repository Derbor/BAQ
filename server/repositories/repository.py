from database.DBConnection import postgresql_connection
import hashlib, uuid
from datetime import datetime, timedelta
from collections import defaultdict
from decimal import Decimal

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


def create_transaction_query(amount, status, user_id, subscription_id=None, last_card_digits=None, device_footprint=None, transaction_ip=None):
    try:
        connection = postgresql_connection()
        new_transaction_id = None
        with connection.cursor() as cursor:
            created_at = datetime.now()
            cursor.execute(
                """
                INSERT INTO transactions (user_id, amount, status, subscription_id, created_at, last_card_digits, device_footprint, transaction_ip)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
                """,
                (user_id, amount, status, subscription_id, created_at, last_card_digits, device_footprint, transaction_ip)
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
    
def get_email_template(recurrent):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT mt.name, mt.content
                FROM message_templates mt
                WHERE mt.type = %s AND mt.recurrent = %s
                """,
                ("MAIL", recurrent)
            )
            result = cursor.fetchone()

        connection.close()
        return result
    except Exception as e:
        print("Error getting the email template: ", e)
        return None
    

def get_subscribed_emails(date):
    try:
        connection = postgresql_connection()
        one_month_ago = date - timedelta(days=30)
        one_month_ago_date = one_month_ago.date()

        print(one_month_ago_date)

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.email
                FROM subscriptions s
                JOIN users u ON u.subscription_id = s.id
                WHERE u.recurrent = %s AND s.status = 'ACTIVE'
                AND s.last_donation_at::date = DATE %s
                """,
                (True, one_month_ago_date,)
            )
            results = cursor.fetchall()
            print(results)

        connection.close()
        emails = [row[0] for row in results]
        return emails

    except Exception as e:
        print("Error getting subscribed emails:", e)
        return []


def get_not_subscribed_emails(date):
    try:
        connection = postgresql_connection()
        one_month_ago = date - timedelta(days=30)
        one_month_ago_date = one_month_ago.date()

        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT u.email
                FROM users u
                WHERE u.recurrent = %s
                AND u.updated_at::date = DATE %s
                """,
                (False, one_month_ago_date,)
            )
            results = cursor.fetchall()

        connection.close()
        emails = [row[0] for row in results]
        return emails

    except Exception as e:
        print("Error getting subscribed emails:", e)
        return []


def create_template_command(content, name, recurrent, type):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO message_templates (recurrent, type, name, content)
                VALUES (%s, %s, %s, %s)
                RETURNING id;
                """,
                (recurrent, type, name, content)
            )
            new_id = cursor.fetchone()[0]
            connection.commit()
            return new_id
    except Exception as e:
        print("Error creating message template:", e)
        return None
    finally:
        if connection:
            connection.close()


def update_template_command(template_id, content, name, recurrent):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                UPDATE message_templates
                SET content = %s, name = %s, recurrent = %s
                WHERE id = %s
                RETURNING id;
                """,
                (content, name, recurrent, template_id)
            )
            updated_id = cursor.fetchone()
            if updated_id:
                connection.commit()
                return updated_id[0]
            else:
                return None
    except Exception as e:
        print("Error updating message template:", e)
        return None
    finally:
        if connection:
            connection.close()


def get_all_message_templates_by_type(type):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT id, recurrent, type, name, content
                FROM message_templates
                WHERE type = %s
                """,
                (type,)
            )
            results = cursor.fetchall()
            return results
    except Exception as e:
        print("Error getting message templates:", e)
        return None
    finally:
        if connection:
            connection.close()


def obtener_montos_por_usuario():
    try:
        connection = postgresql_connection()
        cursor = connection.cursor()

        query = """
        SELECT 
            u.id,
            u.name,
            u.email,
            COALESCE(SUM(t.amount), 0) AS total_amount
        FROM users u
        LEFT JOIN transactions t ON t.user_id = u.id
        GROUP BY u.id, u.name, u.email
        ORDER BY u.name;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        montos_por_usuario = {}

        for user_id, user_name, user_email, total_amount in results:
            montos_por_usuario[user_id] = {
                "name": user_name,
                "email": user_email,
                "total_amount": total_amount
            }

        return montos_por_usuario

    except Exception as e:
        print(f"Error: {e}")
        return {}

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()

    try:
        connection = postgresql_connection()
        cursor = connection.cursor()

        query = """
        SELECT 
            COALESCE(u.name, 'Anónimo') AS user_name,
            COALESCE(s.id, 0) AS subscription_id,
            t.amount
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN subscriptions s ON u.subscription_id = s.id;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        montos_por_usuario = defaultdict(Decimal)

        for user_name, subscription_id, amount in results:
            key = user_name if subscription_id != 0 else 'Anónimo'
            montos_por_usuario[key] += amount

        print(montos_por_usuario)
        return dict(montos_por_usuario)

    except Exception as e:
        print(f"Error: {e}")
        return {}

    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'connection' in locals():
            connection.close()
    try:
        connection = postgresql_connection()
        cursor = conn.cursor()

        # Consulta para obtener montos y datos de usuario
        query = """
        SELECT 
            COALESCE(u.name, 'Anónimo') AS user_name,
            COALESCE(s.id, 0) AS subscription_id,
            t.amount
        FROM transactions t
        LEFT JOIN users u ON t.user_id = u.id
        LEFT JOIN subscriptions s ON u.subscription_id = s.id;
        """

        cursor.execute(query)
        results = cursor.fetchall()

        # Agrupación por nombre o 'Anónimo'
        montos_por_usuario = defaultdict(Decimal)

        for user_name, subscription_id, amount in results:
            key = user_name if subscription_id != 0 else 'Anónimo'
            montos_por_usuario[key] += amount

        print(montos_por_usuario)
        return dict(montos_por_usuario)

    except Exception as e:
        print(f"Error: {e}")
        return {}