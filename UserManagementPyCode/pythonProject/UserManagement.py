import hashlib


class SecurityUtils:
    # Hash the password using SHA-256
    @staticmethod
    def hash_password(password):
        return hashlib.sha256(password.encode()).hexdigest()

    # Verify the password by comparing the hash
    @staticmethod
    def verify_password(password, stored_hash):
        return SecurityUtils.hash_password(password) == stored_hash


class UserManager:
    def __init__(self):
        # Simulating a database using a dictionary
        self.user_database = {}

    # Register a new user
    def register_user(self, username, password):
        hashed_password = SecurityUtils.hash_password(password)
        self.user_database[username] = hashed_password
        print("User registered successfully!")

    # Login a user
    def login_user(self, username, password):
        if username in self.user_database:
            stored_password_hash = self.user_database[username]
            if SecurityUtils.verify_password(password, stored_password_hash):
                print("Login successful!")
                return True
            else:
                print("Incorrect password!")
        else:
            print("User not found!")
        return False


class Dashboard:
    # Display account details (for simplicity, using static values)
    @staticmethod
    def display_dashboard(username):
        print(f"Welcome, {username}!")
        print("Account Balance: $5000")
        print("Recent Transactions:")
        print("- Paid $50 to Utility Company")
        print("- Transferred $200 to John Doe")


# Example usage
if __name__ == "__main__":
    user_manager = UserManager()

    # Register a new user
    user_manager.register_user("johndoe", "password123")

    # Try to login
    if user_manager.login_user("johndoe", "password123"):
        # Show dashboard on successful login
        Dashboard.display_dashboard("johndoe")
