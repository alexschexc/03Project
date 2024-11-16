'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

const parseActivityData = (data) => {
  return data.map(item => ({
    action: item[0],
    details: item[1],
    timestamp: item[2]
  }));
};

export default function ActivityLog() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/view_user_activity')  // Ensure the correct URL
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched Activity Data:", data);  // Log the fetched data
        setActivities(Array.isArray(data) ? parseActivityData(data) : []);  // Ensure data is parsed correctly
      })
      .catch(error => console.error('Error fetching user activity:', error));
  }, []);

  const getActivityIcon = (action) => {
    switch (action) {
      case 'login':
        return 'fa-right-to-bracket text-green-400';
      case 'fund_transfer':
        return 'fa-money-bill-transfer text-[#ff66c4]';
      case 'bill_payment':
        return 'fa-file-invoice-dollar text-yellow-400';
      case 'add_bank_account':
        return 'fa-university text-blue-400';
      default:
        return 'fa-circle-info text-blue-400';
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with Back Button */}
          <div className="flex items-center mb-8">
            <Link 
              href="/security" 
              className="text-gray-400 hover:text-white transition-colors mr-4"
            >
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1 className="text-2xl font-semibold text-white">Activity Log</h1>
          </div>

          {/* Activity Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#272727] rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Total Logins</span>
                <i className="fas fa-user-check text-[#ff66c4]"></i>
              </div>
              <p className="text-2xl font-bold text-white">247</p>
              <p className="text-sm text-gray-400">Last 30 days</p>
            </div>
            <div className="bg-[#272727] rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Failed Attempts</span>
                <i className="fas fa-shield-exclamation text-red-400"></i>
              </div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-sm text-gray-400">Last 30 days</p>
            </div>
            <div className="bg-[#272727] rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400">Active Devices</span>
                <i className="fas fa-mobile-screen text-green-400"></i>
              </div>
              <p className="text-2xl font-bold text-white">2</p>
              <p className="text-sm text-gray-400">Currently active</p>
            </div>
          </div>

          {/* Activity List */}
          <div className="bg-[#272727] rounded-lg">
            {activities.map((activity, index) => (
              <div 
                key={index}
                className={`p-6 flex items-start ${
                  index !== activities.length - 1 ? 'border-b border-[#1a1a1a]' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mr-4">
                  <i className={`fas ${getActivityIcon(activity.action)}`}></i>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">
                        {activity.action ? activity.action.charAt(0).toUpperCase() + activity.action.slice(1) : 'Unknown Action'}
                      </h3>
                      <p className="text-sm text-gray-400">{activity.details}</p>
                    </div>
                    <div className="text-sm text-gray-400">{formatTimestamp(activity.timestamp)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
