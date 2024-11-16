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
    user_manager = UserManager(database)
    bank_transactions = BankTransactions(database, user_manager.send_email_alert)

    try:
        while True:
            print("Options:")
            print("10: Register a new user")
            print("20: Log in")
            print("30: Delete a user")
            print("40: Unlock a user account")
            print("50: Open a new bank account")
            print("00: Quit")

            option = input("Enter an option: ")

            if option == "10":
                username = input("Enter a username: ")
                password = input("Enter a password: ")
                email = input("Enter an email: ")
                user_manager.register_user(username, password, email)
            elif option == "20":
                username = input("Enter your username: ")
                password = input("Enter your password: ")
                otp = input("Enter the OTP from your MFA app: ").replace(" ", "")
                if user_manager.login_user(username, password, otp):
                    logged_in_username = username
                    while True:
                        print("40: Add a bank account")
                        print("50: View bank accounts")
                        print("60: Transfer funds")
                        print("70: Pay a bill")
                        print("80: Deposit or withdraw funds")
                        print("90: Quit")
                        print("100: View payment history")
                        print("110: View user activity")
                        print("120: Open a new bank account")

                        option1 = input("Enter an option: ")

                        if option1 == "40":
                            account_number = input("Enter the account number: ")
                            user_manager.add_bank_account(logged_in_username, account_number)
                        elif option1 == "50":
                            accounts = user_manager.view_bank_accounts(logged_in_username)
                            for account in accounts:
                                print(f"Account Number: {account[0]}, Balance: {account[1]}")
                        elif option1 == "60":
                            from_account = input("Enter the account number to transfer from: ")
                            to_username = input("Enter the username to transfer to: ")
                            to_account = input("Enter the account number to transfer to: ")
                            amount = float(input("Enter the amount to transfer: "))
                            user_manager.transfer_funds(logged_in_username, from_account, to_username, to_account, amount)
                        elif option1 == "70":
                            account_number = input("Enter the account number: ")
                            biller_name = input("Enter the biller name: ")
                            amount = float(input("Enter the amount to pay: "))
                            user_manager.pay_bill(logged_in_username, account_number, biller_name, amount)
                        elif option1 == "80":
                            account_number = input("Enter the account number: ")
                            amount = float(input("Enter the amount: "))
                            transaction_type = input("Enter the transaction type (deposit/withdraw): ").lower()
                            user_manager.deposit_or_withdraw(logged_in_username, account_number, amount, transaction_type)
                        elif option1 == "90":
                            break
                        elif option1 == "100":
                            payment_history = user_manager.view_payment_history(logged_in_username)
                            for record in payment_history:
                                print(f"Account Number: {record[0]}, Biller Name: {record[1]}, Amount: {record[2]}, Timestamp: {record[3]}")
                        elif option1 == "110":
                            user_activity = user_manager.view_user_activity(logged_in_username)
                            for record in user_activity:
                                print(f"Action: {record[0]}, Details: {record[1]}, Timestamp: {record[2]}")
                        elif option1 == "120":
                            account_type = input("Enter the account type (checking/savings/business): ")
                            initial_deposit = float(input("Enter the initial deposit amount: "))
                            if user_manager.add_bank_account(logged_in_username, account_type, initial_deposit):
                                print(f"Opened {account_type} account with initial deposit of ${initial_deposit}.")
                            else:
                                print("Failed to open account.")
                        else:
                            print("Invalid option. Please try again.")
            elif option == "30":
                username = input("Enter the username to delete: ")
                user_manager.delete_user(username)
            elif option == "40":
                username = input("Enter the username to unlock: ")
                user_manager.unlock_user(username)
            elif option == "00":
                break
            else:
                print("Invalid option. Please try again.")
    finally:
        database.close()