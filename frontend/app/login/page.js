"use client";

import { useState } from "react";
import Header from "../components/Header";

export default function Login() {

  return (
    <>
      <div className="min-h-screen bg-[#1D1D1F] pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Login Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="w-full px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                    <i className="fas fa-lock text-black mr-4" />
                  <h2 className="text-xl font-semibold">Sign In</h2>
                </div>
              </div>
              
                <div className="px-6 py-4 border-t">
                  <form className="space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                        focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                        focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          className="h-4 w-4 rounded border-neutral-300 text-neutral-900 
                          focus:ring-neutral-500"
                        />
                        <label
                          htmlFor="remember-me"
                          className="ml-2 block text-sm text-neutral-700"
                        >
                          Remember me
                        </label>
                      </div>
                      <div className="text-sm">
                        <a
                          href="#"
                          className="font-medium text-neutral-700 hover:text-neutral-900"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent 
                      rounded-md shadow-sm text-sm font-medium text-white bg-neutral-900 
                      hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-neutral-500"
                    >
                      Sign In
                    </button>
                  </form>
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
