"use client";
import React from "react";
import Layout from "@/components/Layout";
import TaskList from "@/components/TaskList";

const Dashboard: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-xl shadow-lg">
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          <p className="mt-2 text-lg">Welcome back! Here you can view your tasks and manage your projects in real time.</p>
        </section>
        <section className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
          <TaskList />
        </section>
      </div>
    </Layout>
  );
};

export default Dashboard;
