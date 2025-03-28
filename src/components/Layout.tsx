"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-gray-900 bg-opacity-95 text-white shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="cursor-pointer">
              <h1 className="text-2xl font-bold">Exact Solution</h1>
            </Link>
            {user && (
              <Link href="/dashboard" className="hidden md:inline-block hover:underline">
                Dashboard
              </Link>
            )}
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span aria-label={`Hello ${user.username}`} className="text-lg">
                  Hello, {user.username}
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="hover:underline transition-colors duration-200">
                  Login
                </Link>
                <Link href="/auth/register" className="hover:underline transition-colors duration-200">
                  Register
                </Link>
              </>
            )}
          </nav>
          <button onClick={toggleMenu} className="md:hidden focus:outline-none focus:ring-2 focus:ring-blue-400" aria-label="Toggle Menu">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        <div
          className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuOpen ? "max-h-60 p-4" : "max-h-0 p-0"
          } bg-gray-800`}
        >
          <nav className="flex flex-col space-y-3">
            <Link href="/dashboard" onClick={() => setMenuOpen(false)} className="hover:underline transition-colors duration-200">
              Dashboard
            </Link>
            {user ? (
              <>
                <span className="text-lg">Hello, {user.username}</span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-left transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)} className="hover:underline transition-colors duration-200">
                  Login
                </Link>
                <Link href="/auth/register" onClick={() => setMenuOpen(false)} className="hover:underline transition-colors duration-200">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl mx-auto">{children}</main>
      <footer className="bg-gray-900 text-gray-400 p-4 text-center">
        <p className="text-sm">© {new Date().getFullYear()} Exact Solution. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
