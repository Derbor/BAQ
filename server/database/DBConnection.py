import psycopg2

def postgresql_connection():
    try:
        conn = psycopg2.connect(
            user="postgres.ucemdiedxfdvskpljosq",
            password="qurwyb-kevmym-2wobTy",
            host="aws-0-us-east-2.pooler.supabase.com",
            port="5432",
            dbname="postgres"
        )
        return conn
    except psycopg2.Error as e:
        print(f"Error al conectar a PostgreSQL: {e}")