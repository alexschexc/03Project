'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '../../components/Navbar';

export default function ActivityLog() {
  // Mock data - replace with actual API call
  const activities = [
    {
      type: 'login',
      device: 'MacBook Pro',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      timestamp: '2024-03-15 14:30:45',
      status: 'success'
    },
    {
      type: 'transfer',
      device: 'iPhone 12',
      location: 'San Francisco, CA',
      ip: '192.168.1.2',
      timestamp: '2024-03-15 12:15:22',
      status: 'success'
    },
    {
      type: 'password_change',
      device: 'Chrome Windows',
      location: 'San Francisco, CA',
      ip: '192.168.1.3',
      timestamp: '2024-03-14 09:45:30',
      status: 'success'
    },
    {
      type: 'login',
      device: 'Unknown Device',
      location: 'New York, NY',
      ip: '192.168.1.4',
      timestamp: '2024-03-14 08:30:00',
      status: 'failed'
    }
  ];

  const getActivityIcon = (type, status) => {
    switch (type) {
      case 'login':
        return status === 'success' ? 'fa-right-to-bracket text-green-400' : 'fa-xmark text-red-400';
      case 'transfer':
        return 'fa-money-bill-transfer text-[#ff66c4]';
      case 'password_change':
        return 'fa-key text-yellow-400';
      default:
        return 'fa-circle-info text-blue-400';
    }
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
                  <i className={`fas ${getActivityIcon(activity.type, activity.status)}`}></i>
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</h3>
                      <p className="text-sm text-gray-400">{activity.device}</p>
                      <p className="text-sm text-gray-400">{activity.location}</p>
                      <p className="text-sm text-gray-400">{activity.ip}</p>
                    </div>
                    <div className="text-sm text-gray-400">{activity.timestamp}</div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-400">{activity.status === 'success' ? 'Success' : 'Failed'}</p>
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
