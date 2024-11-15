import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  const footerLinks = [
    { name: "Terms & Conditions", path: "/terms" },
    { name: "Privacy", path: "/privacy" },
    { name: "Notice at Collection", path: "/notice" },
    { name: "CA Privacy Hub", path: "/privacy-hub" },
    { name: "Security", path: "/security" },
    { name: "Contact Us", path: "/contact" },
  ];

  return (
    <footer className="bg-[#1D1D1F] w-full py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4">
        {/* Links Section */}
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {footerLinks.map((link, index) => (
            <Link
              key={index}
              href={link.path}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Copyright and Legal Section */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <p className="text-sm text-gray-400">
              2024 Encrypt Bank
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <Link href="https://github.com" className="text-gray-400 hover:text-white">
                <i className="fab fa-github"></i>
              </Link>
            </div>

            {/* FDIC Logo */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Project for CS 4389</span>
              <span className="text-sm text-gray-400">UTD</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
