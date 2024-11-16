// activity log
// payment history

import React from 'react';
import Navbar from '../components/Navbar';

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <diiv className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-white mb-6">Security Settings</h1>
          
          <div className="bg-[#272727] rounded-lg p-6 mb-6">
            <h2 className="text-xl text-white mb-4">Account Security</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Login History</h3>
                  <p className="text-gray-400 text-sm">View your recent login activity</p>
                </div>
                <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#ff66c4] transition-colors">
                  View
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-white">Password Settings</h3>
                  <p className="text-gray-400 text-sm">Update your password and security preferences</p>
                </div>
                <button className="px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#ff66c4] transition-colors">
                  Change
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#272727] rounded-lg p-6 mb-6">
            <h2 className="text-xl text-white mb-4">Payment History</h2>
            <div className="space-y-4">
              <div className="bg-[#1a1a1a] rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white">Transfer to John Doe</span>
                  <span className="text-red-500">-$500.00</span>
                </div>
                <span className="text-gray-400 text-sm">March 15, 2024</span>
              </div>
            </div>
          </div>
        </div>
      </diiv>
    </>
  );
}