import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#090909]">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-5xl font-medium text-white mb-6">
            Banking that puts your privacy first.
          </h1>
          <p className="text-lg font-light md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Encryption with <span className="text-[#ff66c4] ">bcrypt</span> and user authentication with Multi-Factor 
            Authentication. Your financial data stays
            <span className="text-[#ff66c4] "> private</span>, <span className="text-[#ff66c4] "> secure</span>, and completely <span className="text-[#ff66c4] ">under your control</span>.
          </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-[#1a1a1a] text-white rounded-full 
            hover:bg-[#ff66c4] transition-colors duration-200">
            Start Here
          </Link>
        </div>
      </main>
    </div>
  );
}
