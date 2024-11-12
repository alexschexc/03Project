import psycopg2
from psycopg2 import sql

class Database:
    def __init__(self, dbname, user, password, host='localhost', port='5432'):
        try:
            self.connection = psycopg2.connect(
                dbname=dbname,
                user=user,
                password=password,
                host=host,
                port=port
            )
            self.cursor = self.connection.cursor()
        except psycopg2.OperationalError as e:
            print(f"Error connecting to the database: {e}")
            raise

    def create_user(self, username, password_hash, mfa_secret_hash):
        try:
            self.cursor.execute(
                sql.SQL("INSERT INTO users (username, password_hash, mfa_secret_hash) VALUES (%s, %s, %s)"),
                [username, password_hash, mfa_secret_hash]
            )
            self.connection.commit()
            print("User registered successfully.")
        except psycopg2.IntegrityError:
            self.connection.rollback()
            print("Username already exists.")

    def get_user(self, username):
        self.cursor.execute(
            sql.SQL("SELECT id, password_hash, mfa_secret_hash, balance FROM users WHERE username = %s"),
            [username]
        )
        return self.cursor.fetchone()

    def delete_user(self, username):
        try:
            self.cursor.execute(
                sql.SQL("DELETE FROM users WHERE username = %s"),
                [username]
            )
            self.connection.commit()
            print("User deleted successfully.")
            return True
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error deleting user: {e}")
            return False

    def delete_bank_accounts(self, user_id):
        try:
            self.cursor.execute(
                sql.SQL("DELETE FROM bank_accounts WHERE user_id = %s"),
                [user_id]
            )
            self.connection.commit()
            print("Bank accounts deleted successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error deleting bank accounts: {e}")

    def add_bank_account(self, user_id, account_number):
        try:
            self.cursor.execute(
                sql.SQL("INSERT INTO bank_accounts (user_id, account_number) VALUES (%s, %s)"),
                [user_id, account_number]
            )
            self.connection.commit()
            print("Bank account added successfully.")
        except psycopg2.IntegrityError:
            self.connection.rollback()
            print("Account number already exists.")

    def get_bank_accounts(self, user_id):
        self.cursor.execute(
            sql.SQL("SELECT account_number, balance FROM bank_accounts WHERE user_id = %s"),
            [user_id]
        )
        return self.cursor.fetchall()

    def get_account_balance(self, user_id, account_number):
        self.cursor.execute(
            sql.SQL("SELECT balance FROM bank_accounts WHERE user_id = %s AND account_number = %s"),
            [user_id, account_number]
        )
        result = self.cursor.fetchone()
        return result[0] if result else None

    def update_balance(self, user_id, account_number, new_balance):
        try:
            self.cursor.execute(
                sql.SQL("UPDATE bank_accounts SET balance = %s WHERE user_id = %s AND account_number = %s"),
                [new_balance, user_id, account_number]
            )
            self.connection.commit()
            print("Balance updated successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error updating balance: {e}")

    def log_activity(self, user_id, action, details):
        self.cursor.execute(
            sql.SQL("INSERT INTO logs (user_id, action, details) VALUES (%s, %s, %s)"),
            [user_id, action, details]
        )
        self.connection.commit()

    def update_failed_attempts(self, user_id, reset=False):
        if reset:
            self.cursor.execute("UPDATE users SET failed_attempts = 0 WHERE id = %s", [user_id])
        else:
            self.cursor.execute("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = %s", [user_id])
        self.connection.commit()

    def lock_user(self, user_id):
        self.cursor.execute("UPDATE users SET locked = TRUE WHERE id = %s", [user_id])
        self.connection.commit()

    def get_user_email(self, user_id):
        self.cursor.execute("SELECT email FROM users WHERE id = %s", [user_id])
        result = self.cursor.fetchone()
        return result[0] if result else None

    def close(self):
        self.cursor.close()
        self.connection.close()