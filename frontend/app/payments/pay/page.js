'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function PayPage() {
  const [selectedBill, setSelectedBill] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');

  const bills = [
    {
      id: 1,
      name: "Electricity Bill",
      company: "Power Corp",
      dueDate: "March 25, 2024",
      amount: 150.00,
      status: "Due"
    },
    {
      id: 2,
      name: "Water Bill",
      company: "City Water",
      dueDate: "March 28, 2024",
      amount: 75.50,
      status: "Due"
    },
    {
      id: 3,
      name: "Internet Bill",
      company: "ISP Services",
      dueDate: "March 20, 2024",
      amount: 89.99,
      status: "Overdue"
    }
  ];

  const paymentHistory = [
    {
      id: 1,
      name: "Electricity Bill",
      date: "February 25, 2024",
      amount: 145.00
    },
    {
      id: 2,
      name: "Water Bill",
      date: "February 28, 2024",
      amount: 72.50
    },
    {
      id: 3,
      name: "Internet Bill",
      date: "February 20, 2024",
      amount: 89.99
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Payment submitted:', { selectedBill, paymentAmount });
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
            <h1 className="text-2xl font-semibold text-white">Pay Bills</h1>
          </div>

          {/* Summary Card */}
          <div className="bg-[#272727] rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-gray-400 text-sm">Current Month's Bills</p>
                <h2 className="text-2xl font-bold text-white">$315.49</h2>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Outstanding</p>
                <h2 className="text-2xl font-bold text-red-500">$315.49</h2>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Due Within 7 Days</p>
                <h2 className="text-2xl font-bold text-[#ff66c4]">$225.50</h2>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Bills Section */}
            <div>
              <h2 className="text-xl text-white mb-4">Current Bills</h2>
              <div className="bg-[#272727] rounded-lg p-6 space-y-4">
                {bills.map((bill) => (
                  <div 
                    key={bill.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 cursor-pointer hover:bg-[#2a2a2a] transition-colors"
                    onClick={() => {
                      setSelectedBill(bill.id);
                      setPaymentAmount(bill.amount.toString());
                    }}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-white font-medium">{bill.name}</h3>
                        <p className="text-gray-400 text-sm">{bill.company}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        bill.status === 'Overdue' ? 'bg-red-500/20 text-red-500' : 'bg-[#ff66c4]/20 text-[#ff66c4]'
                      }`}>
                        {bill.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-400 text-sm">Due: {bill.dueDate}</p>
                      <p className="text-white font-medium">${bill.amount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Form */}
            <div>
              <h2 className="text-xl text-white mb-4">Make Payment</h2>
              <div className="bg-[#272727] rounded-lg p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Amount</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                      <input
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full bg-[#1a1a1a] text-white rounded-lg py-3 px-10 focus:outline-none focus:ring-2 focus:ring-[#ff66c4]"
                        placeholder="0.00"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#ff66c4] text-white py-3 px-4 rounded-lg hover:bg-[#ff3399] transition-colors"
                  >
                    Pay Bill
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Payment History */}
          <div className="mt-8">
            <h2 className="text-xl text-white mb-4">Payment History</h2>
            <div className="bg-[#272727] rounded-lg divide-y divide-[#1a1a1a]">
              {paymentHistory.map((payment) => (
                <div key={payment.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                      <i className="fas fa-file-invoice-dollar text-[#ff66c4]"></i>
                    </div>
                    <div>
                      <p className="text-white">{payment.name}</p>
                      <p className="text-gray-400 text-sm">{payment.date}</p>
                    </div>
                  </div>
                  <span className="text-red-500">-${payment.amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
