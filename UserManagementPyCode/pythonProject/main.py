import os
from Database import Database  
from UserManager import UserManager  
import psycopg2

if __name__ == "__main__":
    # Get database connection details from environment variables
    dbname = os.getenv('DB_NAME', 'default_dbname')
    dbuser = os.getenv('DB_USER', 'default_user')
    dbpassword = os.getenv('DB_PASSWORD', 'default_password')

    # Initialize the database connection
    db = Database(dbname=dbname, user=dbuser, password=dbpassword)
    user_manager = UserManager(db)

try:
    while True:
        print("Options:")
        print("10: Register a new user")
        print("20: Log in")
        print("30: Delete a user")
        print("40: Add a bank account")
        print("50: View bank accounts")
        print("60: Quit")
        
        option = input("Enter an option: ")
        
        if option == "10":
            # Register a new user
            username = input("Enter a username: ")
            password = input("Enter a password: ")
            user_manager.register_user(username, password)
        elif option == "20":
            # Attempt to log in
            username = input("Enter your username: ")
            password = input("Enter your password: ")
            otp = input("Enter the OTP from your MFA app: ")
            user_manager.login_user(username, password, otp)
        elif option == "30":
            # Delete a user
            username = input("Enter the username to delete: ")
            user_manager.delete_user(username)
        elif option == "40":
            # Add a bank account
            username = input("Enter the username: ")
            account_number = input("Enter the account number: ")
            user_manager.add_bank_account(username, account_number)
        elif option == "50":
            # View bank accounts
            username = input("Enter the username: ")
            accounts = user_manager.view_bank_accounts(username)
            for account in accounts:
                print(f"Account Number: {account[0]}, Balance: {account[1]}")
        elif option == "60":
            # Quit the loop
            break
        else:
            print("Invalid option. Please try again.")
finally:
    db.close()