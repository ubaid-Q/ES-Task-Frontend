"use client";

import React, { useState } from "react";
import Select from "react-select";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTasks } from "@/hooks/useTask";
import { useUsers } from "@/hooks/useUsers";
import Layout from "@/components/Layout";

const CreateTaskPage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);
  const { createTask } = useTasks();
  const router = useRouter();

  const { users, isLoading: isUsersLoading, error: usersError } = useUsers();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Please enter a task title.");
      return;
    }
    try {
      await createTask({ title, description, assigneeId });
      toast.success("Task created successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Failed to create task. Please try again.");
    }
  };

  const options = users?.map((user: any) => ({
    value: user.id,
    label: user.username,
  }));

  return (
    <Layout>
      <div className="w-xs sm:w-lg md:w-lg mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create New Task
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assign to (optional)
            </label>
            {isUsersLoading && <p className="text-sm text-gray-500">Loading users...</p>}
            {usersError && <p className="text-sm text-red-500">Error loading users</p>}
            {!isUsersLoading && users && options && (
              <Select
                options={options}
                onChange={(selectedOption) =>
                  setAssigneeId(selectedOption ? (selectedOption as any).value : undefined)
                }
                placeholder="Select a user..."
                className="react-select-container"
                classNamePrefix="react-select"
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Create Task
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
};

export default CreateTaskPage;
