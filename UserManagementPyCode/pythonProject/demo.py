from flask import Flask, request, jsonify
import os
from Database import Database
from UserManager import UserManager
from BankTransactions import BankTransactions

app = Flask(__name__)

# Initialize the database connection
dbname = os.getenv('DB_NAME', 'default_dbname')
dbuser = os.getenv('DB_USER', 'default_user')
dbpassword = os.getenv('DB_PASSWORD', 'default_password')
database = Database(dbname=dbname, user=dbuser, password=dbpassword)
bank_transactions = BankTransactions(database)
user_manager = UserManager(database, bank_transactions)

@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password']
    email = data['email']
    success = user_manager.register_user(username, password, email)
    if success:
        return jsonify({"message": "User registered successfully"}), 201
    else:
        return jsonify({"message": "Registration failed"}), 400

@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data['username']
    password = data['password']
    otp = data['otp']
    success = user_manager.login_user(username, password, otp)
    return jsonify({"success": success})

# Add more routes as needed...

if __name__ == "__main__":
    app.run(port=5000)  # Run the Flask app on port 5000