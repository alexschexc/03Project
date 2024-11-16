'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function TransferPaymentPage() {
  const [transferAmount, setTransferAmount] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [note, setNote] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle transfer logic here
    console.log('Transfer submitted:', { transferAmount, recipientName, accountNumber, note });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8">
            <Link 
              href="/payments" 
              className="text-gray-400 hover:text-white transition-colors mr-4"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Transfer Funds</h1>
          </div>

          {/* Balance Card */}
          <div className="bg-[#272727] rounded-lg p-6 mb-8">
            <p className="text-gray-400 text-sm">Available Balance</p>
            <h2 className="text-3xl font-bold text-white">$2,547.23</h2>
          </div>

          {/* Transfer Form */}
          <div className="bg-[#272727] rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                    className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              {/* Recipient Name */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Recipient Name</label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
                  placeholder="Enter recipient name"
                  required
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
                  placeholder="Enter account number"
                  required
                />
              </div>

              {/* Note */}
              <div>
                <label className="block text-gray-400 text-sm mb-2">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#ff66c4] resize-none"
                  placeholder="Add a note"
                  rows="3"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#ff66c4] text-white py-3 px-4 rounded-lg hover:bg-[#ff3399] transition-colors focus:outline-none focus:ring-2 focus:ring-[#ff66c4] focus:ring-offset-2 focus:ring-offset-[#191919]"
              >
                Send Transfer
              </button>
            </form>
          </div>

          {/* Recent Transfers */}
          <div className="mt-8">
            <h2 className="text-xl text-white mb-4">Recent Transfers</h2>
            <div className="bg-[#272727] rounded-lg divide-y divide-[#1a1a1a]">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                      <i className="fas fa-arrow-right text-[#ff66c4]"></i>
                    </div>
                    <div>
                      <p className="text-white">John Doe</p>
                      <p className="text-gray-400 text-sm">Account ending in 1234</p>
                    </div>
                  </div>
                  <span className="text-red-500">-$500.00</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}