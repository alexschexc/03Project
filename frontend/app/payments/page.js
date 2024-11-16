'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

export default function PaymentsPage() {
  const paymentOptions = [
    {
      title: "Transfer Funds",
      description: "Send money to other accounts securely",
      icon: "fa-arrow-right-arrow-left",
      path: "/security/transfer_payment",
      color: "from-[#ff66c4] to-[#ff3399]"
    },
    {
      title: "Pay Bills",
      description: "Pay your bills quickly and easily",
      icon: "fa-file-invoice-dollar",
      path: "/payments/pay_a_bill",
      color: "from-[#66ff84] to-[#33ff57]"
    },
    {
      title: "Withdraw Funds",
      description: "Withdraw money from your accounts",
      icon: "fa-money-bill-transfer",
      path: "/payments/withdraw_fund",
      color: "from-[#66a3ff] to-[#3385ff]"
    }
  ];

  return (
    <div className="min-h-screen bg-[#191919]">
        <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-white">Payments & Transfers</h1>
          <Link 
            href="/security/transfer_payment"
            className="text-sm text-[#ff66c4] hover:text-[#ff3399] transition-colors"
          >
            View Payment History →
          </Link>
        </div>

        {/* Quick Access Balance Card */}
        <div className="bg-[#272727] rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm mb-1">Available Balance</p>
              <h2 className="text-3xl font-bold text-white">$2,547.23</h2>
            </div>
            <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#ff66c4] transition-colors">
              View Accounts
            </button>
          </div>
        </div>

        {/* Payment Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {paymentOptions.map((option, index) => (
            <Link 
              key={index}
              href={option.path}
              className="group"
            >
              <div className="bg-[#272727] rounded-lg p-6 h-full hover:scale-105 transition-transform duration-200 cursor-pointer">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${option.color} flex items-center justify-center mb-4`}>
                  <i className={`fas ${option.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-white text-lg font-medium mb-2">{option.title}</h3>
                <p className="text-gray-400 text-sm">{option.description}</p>
                <div className="mt-4 flex items-center text-[#ff66c4] text-sm group-hover:translate-x-2 transition-transform">
                  <span>Get Started</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity Preview */}
        <div className="mt-8">
          <h2 className="text-xl text-white mb-4">Recent Activity</h2>
          <div className="bg-[#272727] rounded-lg divide-y divide-[#1a1a1a]">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="p-4 flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                    <i className="fas fa-arrow-right text-[#ff66c4]"></i>
                  </div>
                  <div>
                    <p className="text-white">Transfer to John Doe</p>
                    <p className="text-gray-400 text-sm">March {15 - index}, 2024</p>
                  </div>
                </div>
                <span className="text-red-500">-$500.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}