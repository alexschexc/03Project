'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function PaymentHistory() {
  const [filterType, setFilterType] = useState('all');

  // Mock data - replace with actual API call
  const transactions = [
    {
      id: 1,
      type: 'transfer',
      recipient: 'John Doe',
      amount: -500.00,
      date: '2024-03-15',
      status: 'completed',
      accountNumber: '**** 1234',
      description: 'Monthly rent payment'
    },
    {
      id: 2,
      type: 'deposit',
      recipient: 'Salary Deposit',
      amount: 3000.00,
      date: '2024-03-14',
      status: 'completed',
      accountNumber: '**** 5678',
      description: 'March salary'
    },
    {
      id: 3,
      type: 'bill',
      recipient: 'Electric Company',
      amount: -150.00,
      date: '2024-03-13',
      status: 'completed',
      accountNumber: '**** 9012',
      description: 'Monthly electricity bill'
    },
    {
      id: 4,
      type: 'withdrawal',
      recipient: 'ATM Withdrawal',
      amount: -200.00,
      date: '2024-03-12',
      status: 'completed',
      accountNumber: '**** 1234',
      description: 'ATM withdrawal'
    }
  ];

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'transfer':
        return 'fa-arrow-right-arrow-left';
      case 'deposit':
        return 'fa-arrow-down';
      case 'bill':
        return 'fa-file-invoice-dollar';
      case 'withdrawal':
        return 'fa-money-bill-transfer';
      default:
        return 'fa-circle';
    }
  };

  const filteredTransactions = filterType === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filterType);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link 
                href="/payments" 
                className="text-gray-400 hover:text-white transition-colors mr-4"
              >
                <i className="fas fa-arrow-left"></i>
              </Link>
              <h1 className="text-2xl font-semibold text-white">Payment History</h1>
            </div>
            <div className="flex space-x-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-[#272727] text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
              >
                <option value="all">All Transactions</option>
                <option value="transfer">Transfers</option>
                <option value="deposit">Deposits</option>
                <option value="bill">Bills</option>
                <option value="withdrawal">Withdrawals</option>
              </select>
            </div>
          </div>

          {/* Transaction Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#272727] rounded-lg p-6">
              <p className="text-gray-400 text-sm">Total Outgoing</p>
              <p className="text-2xl font-bold text-red-500">-$850.00</p>
              <p className="text-sm text-gray-400">This month</p>
            </div>
            <div className="bg-[#272727] rounded-lg p-6">
              <p className="text-gray-400 text-sm">Total Incoming</p>
              <p className="text-2xl font-bold text-green-500">+$3,000.00</p>
              <p className="text-sm text-gray-400">This month</p>
            </div>
            <div className="bg-[#272727] rounded-lg p-6">
              <p className="text-gray-400 text-sm">Net Change</p>
              <p className="text-2xl font-bold text-white">+$2,150.00</p>
              <p className="text-sm text-gray-400">This month</p>
            </div>
          </div>

          {/* Transactions List */}
          <div className="bg-[#272727] rounded-lg">
            {filteredTransactions.map((transaction, index) => (
              <div 
                key={transaction.id}
                className={`p-6 flex items-start ${
                  index !== filteredTransactions.length - 1 ? 'border-b border-[#1a1a1a]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                  <i className={`fas ${getTransactionIcon(transaction.type)} ${
                    transaction.amount > 0 ? 'text-green-500' : 'text-[#ff66c4]'
                  }`}></i>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-medium">{transaction.recipient}</h3>
                      <p className="text-gray-400 text-sm">{transaction.accountNumber}</p>
                    </div>
                    <span className={`text-lg font-medium ${
                      transaction.amount > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{transaction.description}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    <i className="fas fa-clock mr-2"></i>
                    {transaction.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
