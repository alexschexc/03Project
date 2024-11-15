"use client";

import { useState } from "react";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (/^[0-9]?$/.test(value)) { // Allow only digits (0-9)
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to the next input field if the current one is filled
      if (value && index < otp.length - 1) {
        document.getElementById(`otp-input-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to the previous input field on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle OTP submission logic here
    console.log("OTP Submitted:", otp.join(""));
  };

  return (
    <div className="min-h-screen bg-[#1D1D1F] flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-4">
        <h2 className="text-xl font-semibold text-center">Enter OTP</h2>
        <div className="flex justify-center space-x-2">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-input-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-2xl border border-gray-300 rounded focus:outline-none focus:[#ff66c4]"
              maxLength="1"
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-black text-white rounded-xl hover:bg-[#ff66c4] transition duration-200"
        >
          Submit OTP
        </button>
      </form>
    </div>
  );
}
