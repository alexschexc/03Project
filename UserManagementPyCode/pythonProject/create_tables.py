import os
import psycopg2

def create_tables():
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME', 'default_dbname'),
        user=os.getenv('DB_USER', 'default_user'),
        password=os.getenv('DB_PASSWORD', 'default_password'),
        host=os.getenv('DB_HOST', 'localhost'),
        port=os.getenv('DB_PORT', '5432')
    )
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            mfa_secret_hash VARCHAR(255),
        );
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS bank_accounts (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            account_number VARCHAR(20) UNIQUE NOT NULL,
            balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
        );
    ''')
    conn.commit()
    cursor.close()
    conn.close()

if __name__ == "__main__":
    create_tables()