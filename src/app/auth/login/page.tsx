"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);
    try {
      await login(username, password);
      router.push("/dashboard");
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-transparent">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Login to Your Account
        </h2>
        {errorMsg && (
          <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700 flex justify-between items-center">
            <span>{errorMsg}</span>
            <button
              aria-label="Close error message"
              onClick={() => setErrorMsg(null)}
              className="text-xl font-bold leading-none"
            >
              ×
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white p-3 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : null}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-600 hover:underline transition-colors duration-200"
          >
            Register here
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default LoginPage;
