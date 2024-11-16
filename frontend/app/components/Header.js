"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setIsOpen(false);
  };

  return (
    <header className="bg-white py-4 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="Encrypt Logo" width={120} height={40} className="h-8 w-auto" />
        </Link>
        
        <div className="relative">
          <div 
            className="text-black cursor-pointer"
            onClick={toggleDropdown}
          >
            <i className="fas fa-circle-user text-2xl" />
          </div>
          
          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg">
              {isLoggedIn ? (
                <>
                  <Link href="/account">
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Account
                      <i className="fas fa-user text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/help">
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Help
                      <i className="fas fa-question-circle text-gray-400" />
                    </div>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left"
                  >
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Sign Out
                      <i className="fas fa-sign-out-alt text-gray-400" />
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Sign In
                      <i className="fas fa-lock text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/register">
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Register
                      <i className="fa-solid fa-star text-gray-400" />
                    </div>
                  </Link>
                  <Link href="/help">
                    <div className="px-6 py-3 text-base text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between">
                      Help
                      <i className="fas fa-question-circle text-gray-400" />
                    </div>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
