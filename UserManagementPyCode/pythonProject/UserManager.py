import pyotp
import bcrypt
from cryptography.fernet import Fernet
from Database import Database
import base64
import qrcode
from PIL import Image
from BankTransactions import BankTransactions

class UserManager:
    def __init__(self, db, bank_transactions):
        # Initialize with a database connection and bank transactions
        self.db = db
        self.bank_transactions = bank_transactions

    def _generate_encryption_key(self, username):
        # Generate an encryption key based on the sum of ASCII values of the username
        ascii_sum = sum(ord(char) for char in username)
        # Convert the sum to a 32-byte key (Fernet requires a 32-byte key)
        key = str(ascii_sum).zfill(32).encode('utf-8')
        # Return a Fernet object with the key
        return Fernet(base64.urlsafe_b64encode(key))

    def register_user(self, username, password):
        try:
            # Generate a random MFA secret
            mfa_secret = pyotp.random_base32()
            # Hash the password using bcrypt
            password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            # Generate the encryption key based on the username
            cipher = self._generate_encryption_key(username)
            # Encrypt the MFA secret
            mfa_secret_encrypted = cipher.encrypt(mfa_secret.encode('utf-8')).decode('utf-8')
            # Store the user with the hashed password and encrypted MFA secret in the database
            self.db.create_user(username, password_hash, mfa_secret_encrypted)
            
            # Generate the QR code URL
            qr_code_uri = pyotp.totp.TOTP(mfa_secret).provisioning_uri(username, issuer_name='MyApp')
            # Generate the QR code image
            qr = qrcode.make(qr_code_uri)
            # Display the QR code image
            qr.show()
        except Exception as e:
            print(f"Failed to register user: {e}")

    def login_user(self, username, password, otp):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, password_hash, mfa_secret_encrypted, _ = user
                # Verify the password
                if bcrypt.checkpw(password.encode('utf-8'), password_hash.encode('utf-8')):
                    # Generate the encryption key based on the username
                    cipher = self._generate_encryption_key(username)
                    # Decrypt the MFA secret
                    mfa_secret = cipher.decrypt(mfa_secret_encrypted.encode('utf-8')).decode('utf-8')
                    # Verify the OTP
                    totp = pyotp.TOTP(mfa_secret)
                    if totp.verify(otp):
                        print("Login successful.")
                        return True
                    else:
                        print("Invalid OTP.")
                else:
                    print("Invalid password.")
            else:
                print("User not found.")
        except Exception as e:
            print(f"Failed to login user: {e}")
        return False

    def delete_user(self, username):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _ = user
                # Delete the user's bank accounts first
                self.db.delete_bank_accounts(user_id)
                # Delete the user from the database
                if self.db.delete_user(username):
                    print(f"User {username} deleted successfully.")
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

    def add_bank_account(self, username, account_number):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _ = user
                self.db.add_bank_account(user_id, account_number)
            else:
                print("User not found.")
        except Exception as e:
            print(f"Failed to add bank account: {e}")

    def view_bank_accounts(self, username):
        try:
            # Retrieve the user from the database
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _ = user
                accounts = self.db.get_bank_accounts(user_id)
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
            else:
                print(f"Failed to transfer ${amount} from {from_username} (Account: {from_account}) to {to_username} (Account: {to_account})")
        except Exception as e:
            print(f"Failed to transfer funds: {e}")

    def pay_bill(self, username, account_number, biller_name, amount):
        try:
            # Process bill payment using BankTransactions class
            if self.bank_transactions.process_bill_payment(amount, username, account_number, biller_name):
                print(f"Paid ${amount} to {biller_name} from {username}'s account {account_number}")
            else:
                print(f"Failed to pay ${amount} to {biller_name} from {username}'s account {account_number}")
        except Exception as e:
            print(f"Failed to pay bill: {e}")

    def deposit_or_withdraw(self, username, account_number, amount, transaction_type):
        try:
            # Process deposit or withdrawal using BankTransactions class
            if self.bank_transactions.process_deposit_withdrawal(amount, username, account_number, transaction_type):
                print(f"{transaction_type.capitalize()}ed ${amount} for {username} (Account: {account_number})")
            else:
                print(f"Failed to {transaction_type} ${amount} for {username} (Account: {account_number})")
        except Exception as e:
            print(f"Failed to {transaction_type}: {e}")