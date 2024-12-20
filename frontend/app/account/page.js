"use client";

import Header from "../components/Header";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();

  const handleOpenAccount = () => {
    router.push('/account/open');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#191919] pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-[#191919] rounded-2xl shadow p-6">
            <h1 className="text-2xl text-[#ffffff] font-semibold mb-4">Welcome back!</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#272727] p-6 rounded-lg">
                <h2 className="text-lg text-gray-400 font-medium mb-2">Checking Account</h2>
                <p className="text-3xl text-white font-bold">$2,547.23</p>
                <p className="text-sm text-[#ffffff]">Available Balance</p>
              </div>
              <div className="bg-[#272727] p-6 rounded-lg">
                <h2 className="text-lg text-gray-400 font-medium mb-2">Savings Account</h2>
                <p className="text-3xl text-white font-bold">$10,847.65</p>
                <p className="text-sm text-[#ffffff]">Available Balance</p>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleOpenAccount}
                className="w-full bg-black text-white py-2 px-4 rounded-xl hover:bg-[#ff66c4] transition-colors duration-200"
              >
                Open New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
