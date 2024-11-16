'use client';

import React from 'react';
import Link from 'next/link';

const Navbar = () => {
  const navList = [
    {
      name: "Accounts",
      path: "/account",
    },
    {
      name: "Payments",
      path: "/payments",
    },
    {
      name: "Security",
      path: "/security",
    },
    {
      name: "Help",
      path: "/help",
    }
  ];

  return (
    <nav className="bg-[#1D1D1F] w-full">
      <div className="px-8 md:px-10 lg:px-14 xl:px-32 2xl:px-48 py-2">
        <div className="flex justify-between items-center">
          <div className="flex space-x-6">
            {navList.map((item, index) => (
              <Link 
                key={index} 
                href={item.path}
                className="text-[14px] text-white font-normal hover:text-gray-300 transition-colors py-2"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;