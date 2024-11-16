"use client";

import { useState } from 'react';
import { FAQ_ITEMS, CONTACT_METHODS } from '../constants/constants';
import Navbar from '@/app/components/Navbar';

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq');

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>
            <p className="text-gray-400">Find answers to common questions or contact our support team</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-2 rounded-full ${
                activeTab === 'faq' 
                  ? 'bg-[#ff66c4] text-white' 
                  : 'bg-[#272727] text-gray-300 hover:bg-gray-700'
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-2 rounded-full ${
                activeTab === 'contact' 
                  ? 'bg-[#ff66c4] text-white' 
                  : 'bg-[#272727] text-gray-300 hover:bg-gray-700'
              }`}
            >
              Contact Us
            </button>
          </div>

          {/* Content Section */}
          <div className="space-y-6">
            {activeTab === 'faq' && (
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <div key={index} className="bg-[#272727] rounded-lg p-6">
                    <h3 className="text-white text-lg font-medium mb-2">{item.question}</h3>
                    <p className="text-gray-400">{item.answer}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="grid md:grid-cols-3 gap-6">
                {CONTACT_METHODS.map((method, index) => (
                  <div key={index} className="bg-[#272727] rounded-lg p-6 text-center">
                    <i className={`fas ${method.icon} text-[#ff66c4] text-3xl mb-4`}></i>
                    <h3 className="text-white font-medium mb-2">{method.title}</h3>
                    <p className="text-[#ff66c4] mb-1">{method.detail}</p>
                    <p className="text-gray-400 text-sm">{method.subDetail}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}