import psycopg2
from psycopg2 import sql

class Database:
    def __init__(self, dbname, user, password, host='localhost', port='5432'):
        # Establish a connection to the PostgreSQL database
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

    def create_user(self, username, password_hash, mfa_secret_hash, email):
        # Insert a new user into the users table
        try:
            self.cursor.execute(
                sql.SQL("INSERT INTO users (username, password_hash, mfa_secret_hash, email) VALUES (%s, %s, %s, %s)"),
                [username, password_hash, mfa_secret_hash, email]
            )
            self.connection.commit()
            print("User registered successfully.")
        except psycopg2.IntegrityError:
            self.connection.rollback()
            print("Username or email already exists.")

    def get_user(self, username):
        # Retrieve user details by username
        self.cursor.execute(
            sql.SQL("SELECT id, password_hash, mfa_secret_hash, email, failed_attempts, locked FROM users WHERE username = %s"),
            [username]
        )
        return self.cursor.fetchone()

    def get_user_by_email(self, email):
        # Retrieve user details by email
        self.cursor.execute(
            sql.SQL("SELECT id, username, password_hash, mfa_secret_hash, failed_attempts, locked FROM users WHERE email = %s"),
            [email]
        )
        return self.cursor.fetchone()

    def delete_user(self, username):
        try:
            # Delete a user from the users table by username
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
            # Delete all bank accounts associated with a user
            self.cursor.execute(
                sql.SQL("DELETE FROM bank_accounts WHERE user_id = %s"),
                [user_id]
            )
            self.connection.commit()
            print("Bank accounts deleted successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error deleting bank accounts: {e}")

    def add_bank_account(self, user_id, account_number, account_type, initial_deposit):
        try:
            # Add a new bank account for a user with account type and initial deposit
            self.cursor.execute(
                sql.SQL("INSERT INTO bank_accounts (user_id, account_number, account_type, balance) VALUES (%s, %s, %s, %s)"),
                [user_id, account_number, account_type, initial_deposit]
            )
            self.connection.commit()
            print("Bank account added successfully.")
        except psycopg2.IntegrityError:
            self.connection.rollback()
            print("Account number already exists.")

    def get_bank_accounts(self, user_id):
        # Retrieve all bank accounts for a user
        self.cursor.execute(
            sql.SQL("SELECT account_number, balance FROM bank_accounts WHERE user_id = %s"),
            [user_id]
        )
        return self.cursor.fetchall()

    def get_account_balance(self, user_id, account_number):
        # Retrieve the balance of a specific bank account
        self.cursor.execute(
            sql.SQL("SELECT balance FROM bank_accounts WHERE user_id = %s AND account_number = %s"),
            [user_id, account_number]
        )
        result = self.cursor.fetchone()
        return result[0] if result else None

    def update_balance(self, user_id, account_number, new_balance):
        try:
            # Update the balance of a specific bank account
            self.cursor.execute(
                sql.SQL("UPDATE bank_accounts SET balance = %s WHERE user_id = %s AND account_number = %s"),
                [new_balance, user_id, account_number]
            )
            self.connection.commit()
            print("Balance updated successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error updating balance: {e}")

    def log_admin_activity(self, action, details):
        # Log admin activity in the admin_log table
        self.cursor.execute(
            sql.SQL("INSERT INTO admin_log (action, details) VALUES (%s, %s)"),
            [action, details]
        )
        self.connection.commit()

    def log_user_activity(self, user_id, action, details):
        # Log user activity in the user_activity table
        self.cursor.execute(
            sql.SQL("INSERT INTO user_activity (user_id, action, details) VALUES (%s, %s, %s)"),
            [user_id, action, details]
        )
        self.connection.commit()

    def get_user_activity(self, user_id):
        # Retrieve user activity from the user_activity table
        self.cursor.execute(
            sql.SQL("SELECT action, details, timestamp FROM user_activity WHERE user_id = %s ORDER BY timestamp DESC"),
            [user_id]
        )
        activity = self.cursor.fetchall()
        print(f"Database User Activity: {activity}")  # Log the activity data
        return activity

    def log_payment_history(self, user_id, account_number, biller_name, amount):
        try:
            # Insert payment history into the payment_history table
            self.cursor.execute(
                sql.SQL("INSERT INTO payment_history (user_id, account_number, biller_name, amount) VALUES (%s, %s, %s, %s)"),
                [user_id, account_number, biller_name, amount]
            )
            self.connection.commit()
            print("Payment history logged successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error logging payment history: {e}")

    def get_payment_history(self, user_id):
        # Retrieve payment history for a user
        self.cursor.execute(
            sql.SQL("SELECT account_number, biller_name, amount, timestamp FROM payment_history WHERE user_id = %s ORDER BY timestamp DESC"),
            [user_id]
        )
        return self.cursor.fetchall()

    def update_failed_attempts(self, user_id, reset=False):
        if reset:
            # Reset failed login attempts
            self.cursor.execute("UPDATE users SET failed_attempts = 0 WHERE id = %s", [user_id])
        else:
            # Increment failed login attempts
            self.cursor.execute("UPDATE users SET failed_attempts = failed_attempts + 1 WHERE id = %s", [user_id])
        self.connection.commit()

    def lock_user(self, user_id):
        # Lock a user account after too many failed login attempts
        self.cursor.execute("UPDATE users SET locked = TRUE WHERE id = %s", [user_id])
        self.connection.commit()

    def unlock_user(self, user_id):
        try:
            self.cursor.execute("UPDATE users SET locked = FALSE WHERE id = %s", [user_id])
            self.connection.commit()
            print("User unlocked successfully.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error unlocking user: {e}")

    def get_user_email(self, user_id):
        # Retrieve the email address of a user by user ID
        self.cursor.execute("SELECT email FROM users WHERE id = %s", [user_id])
        result = self.cursor.fetchone()
        return result[0] if result else None

    def update_user_email(self, user_id, new_email):
        try:
            # Update the email address of a user
            self.cursor.execute(
                sql.SQL("UPDATE users SET email = %s WHERE id = %s"),
                [new_email, user_id]
            )
            self.connection.commit()
            print("Email updated successfully.")
        except psycopg2.IntegrityError:
            self.connection.rollback()
            print("Email already exists.")
        except psycopg2.Error as e:
            self.connection.rollback()
            print(f"Error updating email: {e}")

    def close(self):
        # Close the database connection
        self.cursor.close()
        self.connection.close()