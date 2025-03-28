"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function HomePage() {
  const { user } = useAuth();
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="absolute inset-0 bg-black opacity-10 z-0"></div>
      <div className="relative z-10 text-center animate-fadeIn">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-6 drop-shadow-md">Welcome to Task Management</h1>
        <p className="text-xl text-gray-700 mb-10 max-w-2xl mx-auto">
          Manage your tasks seamlessly with our real-time collaborative platform. Join us to stay organized, boost productivity, and achieve
          your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          {user ? (
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white font-medium text-lg px-8 py-4 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
              aria-label="Dashboard"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white font-medium text-lg px-8 py-4 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
                aria-label="Login"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 text-white font-medium text-lg px-8 py-4 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Register"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
