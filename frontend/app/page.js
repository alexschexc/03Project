import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1D1D1F]">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-medium text-white mb-6">
            Banking that puts your privacy first.
          </h1>
          <p className="text-lg font-light md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            End-to-end <span className="text-[#ff66c4] ">encryption</span> protects
            every transaction. Zero data sharing. Your financial data stays
            private, secure, and completely under your control.
          </p>
          <Link href="/register" className="inline-block px-8 py-3 bg-black text-white rounded-full 
            hover:bg-[#ff66c4] transition-colors duration-200">
            Start Here
          </Link>
        </div>
      </main>
    </div>
  );
}
