'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function WithdrawFundsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('');

  const accounts = [
    {
      id: 1,
      name: "Primary Checking",
      number: "****1234",
      balance: 2547.23,
      type: "checking"
    },
    {
      id: 2,
      name: "Secondary Checking",
      number: "****5678",
      balance: 1847.65,
      type: "checking"
    },
    {
      id: 3,
      name: "Primary Savings",
      number: "****9012",
      balance: 10847.65,
      type: "savings"
    },
    {
      id: 4,
      name: "Emergency Savings",
      number: "****3456",
      balance: 5432.10,
      type: "savings"
    }
  ];

  // Get selected account details for displaying balance
  const selectedAccountDetails = accounts.find(acc => acc.id === Number(selectedAccount));

  const recentWithdrawals = [
    {
      id: 1,
      type: "Instant Transfer",
      date: "March 15, 2024",
      amount: 200.00
    },
    {
      id: 2,
      type: "Instant Transfer",
      date: "March 10, 2024",
      amount: 500.00
    },
    {
      id: 3,
      type: "Instant Transfer",
      date: "March 5, 2024",
      amount: 1000.00
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Withdrawal submitted:', { withdrawAmount, selectedAccount });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8">
            <Link 
              href="/payments" 
              className="text-gray-400 hover:text-white transition-colors mr-4"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Withdraw Funds</h1>
          </div>

          {/* Withdrawal Form */}
          <div className="bg-[#272727] rounded-lg p-6 mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Account Selection Dropdown */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Select Account</label>
                <select
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ff66c4] appearance-none cursor-pointer"
                  required
                >
                  <option value="">Choose an account</option>
                  <optgroup label="Checking Accounts">
                    {accounts.filter(acc => acc.type === 'checking').map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} - ${account.balance.toFixed(2)} ({account.number})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Savings Accounts">
                    {accounts.filter(acc => acc.type === 'savings').map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name} - ${account.balance.toFixed(2)} ({account.number})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Selected Account Balance Display */}
              {selectedAccountDetails && (
                <div className="bg-[#1a1a1a] rounded-lg p-4">
                  <p className="text-gray-400 text-sm">Available Balance</p>
                  <p className="text-2xl font-bold text-white">
                    ${selectedAccountDetails.balance.toFixed(2)}
                  </p>
                </div>
              )}

              {/* Amount Input */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Withdrawal Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Funds will be instantly transferred to your linked account
                </p>
              </div>

              <button
                type="submit"
                className="w-full bg-[#ff66c4] text-white py-3 px-4 rounded-lg hover:bg-[#ff3399] transition-colors"
                disabled={!selectedAccount}
              >
                Withdraw Funds
              </button>
            </form>
          </div>

          {/* Recent Withdrawals */}
          <div>
            <h2 className="text-xl text-white mb-4">Recent Withdrawals</h2>
            <div className="bg-[#272727] rounded-lg divide-y divide-[#1a1a1a]">
              {recentWithdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                      <i className="fas fa-bolt text-[#ff66c4]"></i>
                    </div>
                    <div>
                      <p className="text-white">{withdrawal.type}</p>
                      <p className="text-gray-400 text-sm">{withdrawal.date}</p>
                    </div>
                  </div>
                  <span className="text-red-500">-${withdrawal.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}