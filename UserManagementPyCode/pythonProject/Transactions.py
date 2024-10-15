import psycopg2

class Database:
    def __init__(self):
        try:
            # Connect to PostgreSQL database
            self.connection = psycopg2.connect(
                dbname=dbname,
                user="your_username",
                password="your_password",
                host="localhost",
                port="5432"
            )
            self.connection.autocommit = True
            self.cursor = self.connection.cursor()
        except Exception as e:
            print(f"Error connecting to database: {e}")

    def fetch_user_balance(self, username):
        try:
            self.cursor.execute("SELECT balance FROM users WHERE username = %s", (username,))
            result = self.cursor.fetchone()
            if result:
                return result[0]
            else:
                print(f"User {username} not found in database.")
                return None
        except Exception as e:
            print(f"Error fetching balance for {username}: {e}")
            return None

    def update_user_balance(self, username, new_balance):
        try:
            self.cursor.execute("UPDATE users SET balance = %s WHERE username = %s", (new_balance, username))
            print(f"Updated balance for {username}. New balance: ${new_balance}")
        except Exception as e:
            print(f"Error updating balance for {username}: {e}")

    def close_connection(self):
        self.cursor.close()
        self.connection.close()


class TransactionService:
    def __init__(self, transaction_type):
        self.transaction_type = transaction_type

    def process_transaction(self, amount):
        raise NotImplementedError("Subclasses should implement this method")


class FundTransfer(TransactionService):
    def __init__(self, db):
        super().__init__("Fund Transfer")
        self.db = db

    def process_transaction(self, amount, from_username, to_username):
        # Fetch balances for both users
        from_balance = self.db.fetch_user_balance(from_username)
        to_balance = self.db.fetch_user_balance(to_username)

        # Check if both users exist and have enough funds
        if from_balance is None or to_balance is None:
            print("One or both users do not exist.")
            return False

        if from_balance < amount:
            print(f"Insufficient funds in {from_username}'s account.")
            return False

        # Update balances after transfer
        new_from_balance = from_balance - amount
        new_to_balance = to_balance + amount

        self.db.update_user_balance(from_username, new_from_balance)
        self.db.update_user_balance(to_username, new_to_balance)

        print(f"Transferred ${amount} from {from_username} to {to_username}")
        return True


class BillPayment(TransactionService):
    def __init__(self, db):
        super().__init__("Bill Payment")
        self.db = db

    def process_transaction(self, amount, username, biller_name):
        # Fetch balance for user
        user_balance = self.db.fetch_user_balance(username)

        if user_balance is None:
            print(f"User {username} not found.")
            return False

        if user_balance < amount:
            print(f"Insufficient funds in {username}'s account.")
            return False

        # Deduct amount from user account
        new_balance = user_balance - amount
        self.db.update_user_balance(username, new_balance)

        print(f"Paid ${amount} to {biller_name} from {username}'s account")
        return True


class DepositWithdrawal(TransactionService):
    def __init__(self, db):
        super().__init__("Deposit & Withdrawal")
        self.db = db

    def process_transaction(self, amount, username, transaction_type):
        # Fetch balance for user
        user_balance = self.db.fetch_user_balance(username)

        if user_balance is None:
            print(f"User {username} not found.")
            return False

        if transaction_type == "deposit":
            new_balance = user_balance + amount
            self.db.update_user_balance(username, new_balance)
            print(f"Deposited ${amount} to {username}'s account.")
        elif transaction_type == "withdraw":
            if user_balance < amount:
                print(f"Insufficient funds in {username}'s account.")
                return False
            new_balance = user_balance - amount
            self.db.update_user_balance(username, new_balance)
            print(f"Withdrew ${amount} from {username}'s account.")
        else:
            print("Invalid transaction type.")
            return False
        return True
