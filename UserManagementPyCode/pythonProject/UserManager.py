import pyotp
import bcrypt
from cryptography.fernet import Fernet
from Database import Database
import base64
import qrcode
from PIL import Image

class UserManager:
    def __init__(self, db):
        # Initialize with a database connection
        self.db = db

    def _generate_encryption_key(self, username):
        # Generate an encryption key based on the sum of ASCII values of the username
        ascii_sum = sum(ord(char) for char in username)
        # Convert the sum to a 32-byte key (Fernet requires a 32-byte key)
        key = str(ascii_sum).zfill(32).encode('utf-8')
        # Return a Fernet object with the key
        return Fernet(base64.urlsafe_b64encode(key))

    def register_user(self, username, password):
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
    
    def login_user(self, username, password, otp):
        # Retrieve the user from the database
        user = self.db.get_user(username)
        if user:
            user_id, password_hash, mfa_secret_encrypted = user
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
        return False

    def delete_user(self, username):
        # Delete the user from the database
        if self.db.delete_user(username):
            print(f"User {username} deleted successfully.")
            return True
        else:
            print(f"Failed to delete user {username}.")
            return False

    def add_bank_account(self, username, account_number):
        # Retrieve the user from the database
        user = self.db.get_user(username)
        if user:
            user_id, _, _ = user
            self.db.add_bank_account(user_id, account_number)
        else:
            print("User not found.")

    def view_bank_accounts(self, username):
        # Retrieve the user from the database
        user = self.db.get_user(username)
        if user:
            user_id, _, _ = user
            return self.db.get_bank_accounts(user_id)
        else:
            print("User not found.")
            return []