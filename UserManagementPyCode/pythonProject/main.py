import os
from Database import Database
from UserManager import UserManager
from BankTransactions import BankTransactions

# Example usage
if __name__ == "__main__":
    dbname = os.getenv('DB_NAME', 'default_dbname')
    dbuser = os.getenv('DB_USER', 'default_user')
    dbpassword = os.getenv('DB_PASSWORD', 'default_password')

    # Initialize the database connection
    database = Database(dbname=dbname, user=dbuser, password=dbpassword)
    bank_transactions = BankTransactions(database)
    user_manager = UserManager(database, bank_transactions)

    try:
        while True:
            print("Options:")
            print("10: Register a new user")
            print("20: Log in")
            print("30: Delete a user")
            print("40: Add a bank account")
            print("50: View bank accounts")
            print("60: Transfer funds")
            print("70: Pay a bill")
            print("80: Deposit or withdraw funds")
            print("90: Quit")

            option = input("Enter an option: ")

            if option == "10":
                username = input("Enter a username: ")
                password = input("Enter a password: ")
                user_manager.register_user(username, password)
            elif option == "20":
                username = input("Enter your username: ")
                password = input("Enter your password: ")
                otp = input("Enter the OTP from your MFA app: ")
                user_manager.login_user(username, password, otp)
            elif option == "30":
                username = input("Enter the username to delete: ")
                user_manager.delete_user(username)
            elif option == "40":
                username = input("Enter the username: ")
                account_number = input("Enter the account number: ")
                user_manager.add_bank_account(username, account_number)
            elif option == "50":
                username = input("Enter the username: ")
                accounts = user_manager.view_bank_accounts(username)
                for account in accounts:
                    print(f"Account Number: {account[0]}, Balance: {account[1]}")
            elif option == "60":
                from_username = input("Enter the username to transfer from: ")
                from_account = input("Enter the account number to transfer from: ")
                to_username = input("Enter the username to transfer to: ")
                to_account = input("Enter the account number to transfer to: ")
                amount = float(input("Enter the amount to transfer: "))
                user_manager.transfer_funds(from_username, from_account, to_username, to_account, amount)
            elif option == "70":
                username = input("Enter the username: ")
                account_number = input("Enter the account number: ")
                biller_name = input("Enter the biller name: ")
                amount = float(input("Enter the amount to pay: "))
                user_manager.pay_bill(username, account_number, biller_name, amount)
            elif option == "80":
                username = input("Enter the username: ")
                account_number = input("Enter the account number: ")
                amount = float(input("Enter the amount: "))
                transaction_type = input("Enter the transaction type (deposit/withdraw): ").lower()
                user_manager.deposit_or_withdraw(username, account_number, amount, transaction_type)
            elif option == "90":
                break
            else:
                print("Invalid option. Please try again.")
    finally:
        database.close()