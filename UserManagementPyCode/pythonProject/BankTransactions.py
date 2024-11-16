from decimal import Decimal

class BankTransactions:
    def __init__(self, db, send_email_alert):
        self.db = db
        self.send_email_alert = send_email_alert

    def process_fund_transfer(self, amount, from_username, from_account, to_username, to_account):
        try:
            from_user = self.db.get_user(from_username)
            to_user = self.db.get_user(to_username)
            if from_user and to_user:
                from_user_id, _, _, _, _, _ = from_user  # Adjusted to match the number of values returned by get_user
                to_user_id, _, _, _, _, _ = to_user  # Adjusted to match the number of values returned by get_user
                from_balance = self.db.get_account_balance(from_user_id, from_account)
                to_balance = self.db.get_account_balance(to_user_id, to_account)
                amount = Decimal(amount)
                if from_balance >= amount:
                    new_from_balance = from_balance - amount
                    new_to_balance = to_balance + amount
                    self.db.update_balance(from_user_id, from_account, new_from_balance)
                    self.db.update_balance(to_user_id, to_account, new_to_balance)

                    # Log fund transfer
                    self.db.log_user_activity(from_user_id, "fund_transfer", f"Transferred ${amount} to {to_username}.")
                    self.db.log_user_activity(to_user_id, "fund_transfer", f"Received ${amount} from {from_username}.")
                    self.db.log_payment_history(from_user_id, from_account, to_username, amount)
                    self.db.log_payment_history(to_user_id, to_account, from_username, amount)

                    # Send email notifications
                    from_user_email = self.db.get_user_email(from_user_id)
                    to_user_email = self.db.get_user_email(to_user_id)

                    # Notify users via email using send_email_alert method
                    self.send_email_alert(from_user_email, "Transfer Notification", f"You transferred ${amount} to {to_username}.")
                    self.send_email_alert(to_user_email, "Transfer Notification", f"You received ${amount} from {from_username}.")

                    self.db.log_admin_activity("fund_transfer", f"Transferred ${amount} from {from_username} to {to_username}.")
                    return True
                else:
                    print("Insufficient funds.")
                    return False
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to process fund transfer: {e}")
            return False

    def process_bill_payment(self, amount, username, account_number, biller_name):
        try:
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                balance = self.db.get_account_balance(user_id, account_number)
                amount = Decimal(amount)
                if balance >= amount:
                    new_balance = balance - amount
                    self.db.update_balance(user_id, account_number, new_balance)

                    # Log bill payment
                    self.db.log_user_activity(user_id, "bill_payment", f"Paid ${amount} to {biller_name}.")
                    self.db.log_payment_history(user_id, account_number, biller_name, amount)

                    self.db.log_admin_activity("bill_payment", f"User {username} paid ${amount} to {biller_name}.")
                    print(f"Bill payment of ${amount} to {biller_name} successful.")
                    return True
                else:
                    print("Insufficient funds.")
                    return False
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to process bill payment: {e}")
            return False

    def process_deposit_withdrawal(self, amount, username, account_number, transaction_type):
        try:
            user = self.db.get_user(username)
            if user:
                user_id, _, _, _, _, _ = user  # Adjusted to match the number of values returned by get_user
                balance = self.db.get_account_balance(user_id, account_number)
                amount = Decimal(amount)
                if transaction_type == "deposit":
                    new_balance = balance + amount
                elif transaction_type == "withdraw" and balance >= amount:
                    new_balance = balance - amount
                else:
                    print("Insufficient funds.")
                    return False
                self.db.update_balance(user_id, account_number, new_balance)

                # Log deposit or withdrawal
                self.db.log_user_activity(user_id, transaction_type, f"{transaction_type.capitalize()}ed ${amount} (Account: {account_number}).")
                self.db.log_payment_history(user_id, account_number, transaction_type, amount)

                self.db.log_admin_activity(transaction_type, f"User {username} {transaction_type}ed ${amount}.")
                return True
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to process {transaction_type}: {e}")
            return False