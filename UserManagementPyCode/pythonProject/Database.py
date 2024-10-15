import psycopg2
from psycopg2 import sql

class Database:
    def __init__(self, dbname, user, password, host='localhost', port='5432'):
        try:
            # Initialize the database connection
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
            # Insert the new user into the users table
            # Avoid sql injection by using the format method of the sql module
            self.cursor.execute(
                sql.SQL("INSERT INTO users (username, password_hash, mfa_secret_hash) VALUES (%s, %s, %s)"),
                [username, password_hash, mfa_secret_hash]
            )
            # Commit the transaction
            self.connection.commit()
            print("User registered successfully.")
        except psycopg2.IntegrityError:
            # Rollback the transaction if there is an integrity error (e.g., duplicate username)
            self.connection.rollback()
            print("Username already exists.")

    def get_user(self, username):
        # Retrieve the user's password hash and MFA secret hash from the users table
        self.cursor.execute(
            sql.SQL("SELECT id, password_hash, mfa_secret_hash FROM users WHERE username = %s"),
            [username]
        )
        return self.cursor.fetchone()

    def delete_user(self, username):
        try:
            # Delete the user from the users table
            self.cursor.execute(
                sql.SQL("DELETE FROM users WHERE username = %s"),
                [username]
            )
            # Commit the transaction
            self.connection.commit()
            print("User deleted successfully.")
            return True
        except psycopg2.Error as e:
            # Rollback the transaction if there is an error
            self.connection.rollback()
            print(f"Error deleting user: {e}")
            return False

    def add_bank_account(self, user_id, account_number):
        try:
            # Insert a new bank account for the user
            self.cursor.execute(
                sql.SQL("INSERT INTO bank_accounts (user_id, account_number) VALUES (%s, %s)"),
                [user_id, account_number]
            )
            # Commit the transaction
            self.connection.commit()
            print("Bank account added successfully.")
        except psycopg2.IntegrityError:
            # Rollback the transaction if there is an integrity error (e.g., duplicate account number)
            self.connection.rollback()
            print("Account number already exists.")

    def get_bank_accounts(self, user_id):
        # Retrieve the bank accounts for the user
        self.cursor.execute(
            sql.SQL("SELECT account_number, balance FROM bank_accounts WHERE user_id = %s"),
            [user_id]
        )
        return self.cursor.fetchall()

    def close(self):
        # Close the cursor and the database connection
        self.cursor.close()
        self.connection.close()