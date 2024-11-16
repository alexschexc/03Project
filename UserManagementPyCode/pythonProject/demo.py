from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import os
from Database import Database
from UserManager import UserManager
from BankTransactions import BankTransactions
from decimal import Decimal

app = Flask(__name__)
CORS(app)  # Enable CORS for the Flask app

# Initialize the database connection
dbname = os.getenv('DB_NAME', 'default_dbname')
dbuser = os.getenv('DB_USER', 'default_user')
dbpassword = os.getenv('DB_PASSWORD', 'default_password')
database = Database(dbname=dbname, user=dbuser, password=dbpassword)
user_manager = UserManager(database)
bank_transactions = BankTransactions(database, user_manager.send_email_alert)

logged_in_username = None  # Global variable to store the logged-in username

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
    global logged_in_username
    data = request.json
    username = data['username']
    password = data['password']
    otp = data['otp']
    success = user_manager.login_user(username, password, otp)
    if success:
        logged_in_username = username  # Save the logged-in username
    return jsonify({"success": success})

@app.route('/open_account', methods=['POST'])
def open_account():
    global logged_in_username
    data = request.json
    username = logged_in_username  # Use the global logged-in username
    account_type = data['account_type']
    initial_deposit = Decimal(data['initial_deposit'])
    if user_manager.add_bank_account(username, account_type, initial_deposit):
        return jsonify({"message": "Account opened successfully"}), 201
    else:
        return jsonify({"message": "Failed to open account"}), 400

# Add more routes as needed...

if __name__ == "__main__":
    app.run(port=5000)  # Run the Flask app on port 5000