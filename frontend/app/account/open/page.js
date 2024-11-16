"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../../components/Navbar";

export default function OpenAccount() {
  const router = useRouter();
  const [accountType, setAccountType] = useState("");
  const [initialDeposit, setInitialDeposit] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const loggedInUsername = localStorage.getItem('loggedInUsername'); // Retrieve the logged-in username from local storage
      const response = await fetch('http://localhost:5000/open_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loggedInUsername, // Use the retrieved username
          account_type: accountType,
          initial_deposit: initialDeposit,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage("Account opened successfully. Redirecting...");
        setTimeout(() => {
          router.push('/account');
        }, 2000); // Redirect to account page after 2 seconds
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#090909] pt-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-semibold mb-6">Open New Account</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type
                </label>
                <select
                  value={accountType}
                  onChange={(e) => setAccountType(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select Account Type</option>
                  <option value="checking">Checking Account</option>
                  <option value="savings">Savings Account</option>
                  <option value="business">Business Account</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Initial Deposit Amount ($)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={initialDeposit}
                  onChange={(e) => setInitialDeposit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Enter amount"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  Open Account
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/account')}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
            {message && <p className="mt-4 text-center text-sm text-neutral-700">{message}</p>}
          </div>
        </div>
      </div>
    </>
  );
}