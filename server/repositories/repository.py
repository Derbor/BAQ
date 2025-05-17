from database.DBConnection import postgresql_connection
import hashlib, uuid

def email_exist(email):
    try:
        connection = postgresql_connection()
        with connection.cursor() as cursor:
            cursor.execute(
                """
                SELECT EXISTS (
                    SELECT 1 FROM users WHERE email = %s
                );
                """,
                (email,)
            )
            exists = cursor.fetchone()[0]
        connection.close()
        return exists  # True o False
    except Exception as e:
        print("Error checking if user exists:", e)
        return False



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

