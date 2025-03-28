"use client";
import React, { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import toast, { Toaster } from "react-hot-toast";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { SocketProvider } from "@/contexts/SocketContext";

const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Task Management</title>
        <meta name="description" content="Real-Time Collaborative Task Management System" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-secondary text-foreground">
        <AuthProvider>
          <SocketProvider>
            <QueryClientProvider client={queryClient}>
              <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
                <div className="min-h-screen flex flex-col">{children}</div>
              </Suspense>
              <ReactQueryDevtools initialIsOpen={false} />
              <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
            </QueryClientProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
