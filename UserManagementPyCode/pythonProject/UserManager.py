import pyotp
import bcrypt
import smtplib
from email.mime.text import MIMEText
from cryptography.fernet import Fernet
from Database import Database
import base64
import qrcode
from PIL import Image
from BankTransactions import BankTransactions
import os
import uuid

class UserManager:
    def __init__(self, db):
        # Initialize with a database connection
        self.db = db
        self.bank_transactions = BankTransactions(db, self.send_email_alert)
        self.logged_in_username = None  # Add this line to store the logged-in username

    def _generate_encryption_key(self, username):
        # Generate an encryption key based on the sum of ASCII values of the username
        ascii_sum = sum(ord(char) for char in username)
        # Convert the sum to a 32-byte key (Fernet requires a 32-byte key)
        key = str(ascii_sum).zfill(32).encode('utf-8')
        # Return a Fernet object with the key
        return Fernet(base64.urlsafe_b64encode(key))

    def register_user(self, username, password, email):
        try:
            # Check if email is already registered
            if self.db.get_user_by_email(email):
                print("Email already registered.")
                return False
            # Generate a random MFA secret
            mfa_secret = pyotp.random_base32()
            # Hash the password using bcrypt for secure storage
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            # Generate the encryption key based on the username
            cipher = self._generate_encryption_key(username)
            # Encrypt the MFA secret
            mfa_secret_encrypted = cipher.encrypt(mfa_secret.encode('utf-8')).decode('utf-8')
            # Encrypt the email
            email_encrypted = cipher.encrypt(email.encode('utf-8')).decode('utf-8')
            # Store the user with the hashed password and encrypted MFA secret in the database
            self.db.create_user(username, password_hash, mfa_secret_encrypted, email_encrypted)
            
            # Generate the QR code URL for MFA setup
            qr_code_uri = pyotp.totp.TOTP(mfa_secret).provisioning_uri(username, issuer_name='MyApp')
            # Generate the QR code image
            qr = qrcode.make(qr_code_uri)
            # Display the QR code image
            qr.show()
            self.db.log_admin_activity("register_user", f"Registered user {username}.")
            return True
        except Exception as e:
            print(f"Failed to register user: {e}")
            return False

    def login_user(self, username, password, otp):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, password_hash, mfa_secret_encrypted, email_encrypted, failed_attempts, locked = user

                if locked:
                    print("User is locked out, please contact admin.")
                    self.db.log_user_activity(user_id, "login_attempt_locked", "Attempted to log in to a locked account.")
                    self.db.log_admin_activity("login_attempt_locked", f"User {username} attempted to log in to a locked account.")
                    return False
                # Verify the password using bcrypt
                if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                    # Generate the encryption key based on the username
                    cipher = self._generate_encryption_key(username)
                    # Decrypt the MFA secret
                    mfa_secret = cipher.decrypt(mfa_secret_encrypted.encode('utf-8')).decode('utf-8')
                   # print(f"Decrypted MFA Secret: {mfa_secret}")  # Debug logging
                    # Decrypt the email
                    email = cipher.decrypt(email_encrypted.encode('utf-8')).decode('utf-8')
                    # Verify the OTP using pyotp
                    totp = pyotp.TOTP(mfa_secret)
                    print(f"Generated OTP: {totp.now()}")  # Debug logging

                    if totp.verify(otp):
                        print("Login successful.")
                        self.logged_in_username = username  # Save the logged-in username
                        # Reset failed attempts on successful login
                        self.db.update_failed_attempts(user_id, reset=True)
                        self.db.log_user_activity(user_id, "login", "User logged in successfully.")
                        self.db.log_admin_activity("login_user", f"User {username} logged in successfully.")
                        return True
                    else:
                        print("Invalid OTP.")
                        self.db.log_user_activity(user_id, "failed_login", "Failed login attempt due to invalid OTP.")
                        self.db.log_admin_activity("failed_login", f"Failed login attempt for user {username} due to invalid OTP.")
                else:
                    print("Invalid password.")
                    self.db.log_user_activity(user_id, "failed_login", "Failed login attempt due to invalid password.")
                    self.db.log_admin_activity("failed_login", f"Failed login attempt for user {username} due to invalid password.")
                # Handle failed attempt
                self.db.update_failed_attempts(user_id)
                failed_attempts += 1

                # Lock account after 3 failed attempts
                if failed_attempts >= 3:
                    self.db.lock_user(user_id)
                    print("Account locked due to too many failed attempts. User has been locked out.")
                    user_email = self.db.get_user_email(user_id)
                    self.send_email_alert(user_email, "Account Locked",
                                          "Your account has been locked after multiple failed login attempts.")
                    self.db.log_user_activity(user_id, "account_locked", "Account locked due to failed login attempts.")
                    self.db.log_admin_activity("lock_user", f"Locked user {username} due to failed login attempts.")

                self.db.log_admin_activity("login_user", f"Failed login attempt for user {username}.")
            else:
                print("User not found.")
                self.db.log_admin_activity("failed_login", f"Failed login attempt for non-existent user {username}.")
        except Exception as e:
            print(f"Failed to login user: {e}")
        return False

    def delete_user(self, username):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                # Delete the user's bank accounts first
                self.db.delete_bank_accounts(user_id)
                # Delete the user from the database
                if self.db.delete_user(username):
                    print(f"User {username} deleted successfully.")
                    self.db.log_admin_activity("delete_user", f"Deleted user {username}.")
                    return True
                else:
                    print(f"Failed to delete user {username}.")
                    return False
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to delete user: {e}")
            return False

    def add_bank_account(self, username, account_type, initial_deposit):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                # Generate a unique account number within the limit of 20 characters
                account_number = str(uuid.uuid4())[:20]
                self.db.add_bank_account(user_id, account_number, account_type, initial_deposit)
                self.db.log_user_activity(user_id, "add_bank_account", f"Added bank account {account_number}.")
                self.db.log_admin_activity("add_bank_account", f"Added bank account {account_number} for user {username}.")
                return True
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to add bank account: {e}")
            return False

    def view_bank_accounts(self, username):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                accounts = self.db.get_bank_accounts(user_id)
                self.db.log_user_activity(user_id, "view_bank_accounts", "Viewed bank accounts.")
                self.db.log_admin_activity("view_bank_accounts", f"User {username} viewed bank accounts.")
                return accounts
            else:
                print("User not found.")
                return []
        except Exception as e:
            print(f"Failed to view bank accounts: {e}")
            return []

    def transfer_funds(self, from_username, from_account, to_username, to_account, amount):
        try:
            # Process fund transfer using BankTransactions class
            if self.bank_transactions.process_fund_transfer(amount, from_username, from_account, to_username, to_account):
                print(f"Transferred ${amount} from {from_username} (Account: {from_account}) to {to_username} (Account: {to_account})")
                # Log fund transfer
                from_user = self.db.get_user(from_username)
                to_user = self.db.get_user(to_username)
                if from_user and to_user:
                    from_user_id, _, _, _, _, _ = from_user  # Adjusted to match the number of values returned by get_user
                    to_user_id, _, _, _, _, _ = to_user  # Adjusted to match the number of values returned by get_user
                    self.db.log_user_activity(from_user_id, "transfer_funds", f"Transferred ${amount} to {to_username} (Account: {to_account}).")
                    self.db.log_user_activity(to_user_id, "transfer_funds", f"Received ${amount} from {from_username} (Account: {from_account}).")
                    self.db.log_admin_activity("transfer_funds", f"Transferred ${amount} from {from_username} (Account: {from_account}) to {to_username} (Account: {to_account}).")
            else:
                print(f"Failed to transfer ${amount} from {from_username} (Account: {from_account}) to {to_username} (Account: {to_account})")
        except Exception as e:
            print(f"Failed to transfer funds: {e}")

    def pay_bill(self, username, account_number, biller_name, amount):
        try:
            # Process bill payment using BankTransactions class
            if self.bank_transactions.process_bill_payment(amount, username, account_number, biller_name):
                print(f"Paid ${amount} to {biller_name} from {username}'s account {account_number}")
                # Log payment history
                user = self.db.get_user(username)
                if user:
                    user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                    self.db.log_user_activity(user_id, "pay_bill", f"Paid ${amount} to {biller_name}.")
                    self.db.log_payment_history(user_id, account_number, biller_name, amount)
                    self.db.log_admin_activity("pay_bill", f"User {username} paid ${amount} to {biller_name} from account {account_number}.")
            else:
                print(f"Failed to pay ${amount} to {biller_name} from {username}'s account {account_number}")
        except Exception as e:
            print(f"Failed to pay bill: {e}")

    def deposit_or_withdraw(self, username, account_number, amount, transaction_type):
        try:
            # Process deposit or withdrawal using BankTransactions class
            if self.bank_transactions.process_deposit_withdrawal(amount, username, account_number, transaction_type):
                print(f"{transaction_type.capitalize()}ed ${amount} for {username} (Account: {account_number})")
                # Log deposit or withdrawal
                user = self.db.get_user(username)
                if user:
                    user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                    self.db.log_payment_history(user_id, account_number, transaction_type, amount)
                    self.db.log_user_activity(user_id, transaction_type, f"{transaction_type.capitalize()}ed ${amount} (Account: {account_number}).")
                    self.db.log_admin_activity(transaction_type, f"User {username} {transaction_type}ed ${amount} (Account: {account_number}).")
                return True
            else:
                print(f"Failed to {transaction_type} ${amount} for {username} (Account: {account_number})")
        except Exception as e:
            print(f"Failed to {transaction_type}: {e}")

    def send_email_alert(self, to_address, subject, message):
        # Create the email message
        msg = MIMEText(message)
        msg['Subject'] = subject
        msg['From'] = "noreply@bankapp.com"
        msg['To'] = to_address

        # Send the email using Gmail SMTP
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(os.getenv("your_email"), os.getenv("your_email_password"))
            server.sendmail("noreply@bankapp.com", to_address, msg.as_string())

    def view_payment_history(self, username):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                # Retrieve payment history from the database
                payment_history = self.db.get_payment_history(user_id)
                self.db.log_user_activity(user_id, "view_payment_history", "Viewed payment history.")
                self.db.log_admin_activity("view_payment_history", f"User {username} viewed payment history.")
                return payment_history
            else:
                print("User not found.")
                return []
        except Exception as e:
            print(f"Failed to view payment history: {e}")
            return []

    def view_user_activity(self, username):
        try:
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user
                user_activity = self.db.get_user_activity(user_id)
                self.db.log_admin_activity("view_user_activity", f"Viewed activity for user {username}.")
                return user_activity
            else:
                print("User not found.")
                return []
        except Exception as e:
            print(f"Failed to view user activity: {e}")
            return []

    def unlock_user(self, username):
        try:
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user
                self.db.unlock_user(user_id)
                self.db.update_failed_attempts(user_id, reset=True)
                print(f"User {username} unlocked successfully.")
                self.db.log_admin_activity("unlock_user", f"Unlocked user {username}.")
                return True
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to unlock user: {e}")
            return False