from decimal import Decimal

class BankTransactions:
    def __init__(self, db):
        self.db = db

    def process_fund_transfer(self, amount, from_username, from_account, to_username, to_account):
        try:
            from_user = self.db.get_user(from_username)
            to_user = self.db.get_user(to_username)
            if from_user and to_user:
                from_user_id, _, _, _ = from_user
                to_user_id, _, _, _ = to_user
                from_balance = self.db.get_account_balance(from_user_id, from_account)
                to_balance = self.db.get_account_balance(to_user_id, to_account)
                amount = Decimal(amount)
                if from_balance >= amount:
                    new_from_balance = from_balance - amount
                    new_to_balance = to_balance + amount
                    self.db.update_balance(from_user_id, from_account, new_from_balance)
                    self.db.update_balance(to_user_id, to_account, new_to_balance)
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
                user_id, _, _, _ = user
                balance = self.db.get_account_balance(user_id, account_number)
                amount = Decimal(amount)
                if balance >= amount:
                    new_balance = balance - amount
                    self.db.update_balance(user_id, account_number, new_balance)
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
                user_id, _, _, _ = user
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
                return True
            else:
                print("User not found.")
                return False
        except Exception as e:
            print(f"Failed to process {transaction_type}: {e}")
            return False