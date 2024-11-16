"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, otp }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Login successful. Redirecting...");
        setTimeout(() => {
          router.push('/account'); // Redirect to account page after successful login
        }, 2000);
      } else if (data.message === "User is locked out, please contact admin.") {
        setMessage("User is locked out. Please contact admin.");
      } else {
        setMessage("Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[#191919] pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="w-full px-6 py-4 flex items-center justify-between">
                <div className="flex items-center">
                  <i className="fas fa-lock text-black mr-4" />
                  <h2 className="text-xl font-semibold">Sign In</h2>
                </div>
              </div>
              <div className="px-6 py-4 border-t">
                <form className="space-y-4" onSubmit={handleLogin}>
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-neutral-700">
                      Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-neutral-700">
                      OTP
                    </label>
                    <input
                      type="text"
                      id="otp"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm focus:border-neutral-500 focus:ring-neutral-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#1a1a1a] hover:bg-[#ff66c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff66c4]"
                  >
                    Sign In
                  </button>
                </form>
                {message && <p className="mt-4 text-center text-sm text-neutral-700">{message}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
