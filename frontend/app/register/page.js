"use client";

import { useState } from "react";
import Header from "../components/Header";

export default function Register() {

  return (
    <>
      <div className="min-h-screen bg-[#1D1D1F] pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {/* Register Section */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div
                className="w-full px-6 py-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                    <i className="fa-solid fa-star text-black-400 mr-4" />
                  <h2 className="text-xl font-semibold">
                    Register
                  </h2>
                </div>
              </div>

                <div className="px-6 py-4 border-t">
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                          focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-neutral-700"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                          focus:border-neutral-500 focus:ring-neutral-500"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="newUsername"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Username
                      </label>
                      <input
                        type="text"
                        id="newUsername"
                        name="username"
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                        focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        name="password"
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                        focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-neutral-700"
                      >
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="mt-1 block w-full rounded-md border-neutral-300 shadow-sm 
                        focus:border-neutral-500 focus:ring-neutral-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent 
                      rounded-md shadow-sm text-sm font-medium text-white bg-neutral-900 
                      hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 
                      focus:ring-neutral-500"
                    >
                      Apply Now
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
