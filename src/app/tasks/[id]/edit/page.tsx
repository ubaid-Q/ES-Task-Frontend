"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTasks } from "@/hooks/useTask";
import { useUsers } from "@/hooks/useUsers";
import Layout from "@/components/Layout";
import { fetchTask } from "@/api/tasks";

interface TaskType {
  id: string;
  title: string;
  description?: string;
  status: string;
  assignee?: { id: string; username: string };
}

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const taskId = params?.id as string;

  const [task, setTask] = useState<TaskType | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | undefined>(undefined);

  const { updateTask: updateTaskMutation } = useTasks();
  const { users, isLoading: isUsersLoading, error: usersError } = useUsers();

  useEffect(() => {
    async function loadTask() {
      try {
        const fetchedTask: TaskType = await fetchTask(taskId);
        setTask(fetchedTask);
        setTitle(fetchedTask.title);
        setDescription(fetchedTask.description || "");
        if (fetchedTask.assignee) {
          setAssigneeId(fetchedTask.assignee.id);
        }
      } catch (error) {
        toast.error("Failed to load task.");
      }
    }
    if (taskId) loadTask();
  }, [taskId]);

  const options =
    users?.map((user: any) => ({
      value: user.id,
      label: user.username,
    })) || [];

  const handleAssigneeChange = (selectedOption: any) => {
    setAssigneeId(selectedOption ? selectedOption.value : undefined);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Task title is required.");
      return;
    }
    try {
      await updateTaskMutation({ id: taskId, taskData: { title, description, assigneeId } });
      toast.success("Task updated successfully!");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } catch (error) {
      toast.error("Failed to update task. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto my-10 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Task</h2>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              placeholder="Task title"
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
              placeholder="Task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              rows={4}
            ></textarea>
          </div>
          <div className="flex flex-col">
            <label className="block text-sm font-medium text-gray-700 mb-1">Assign to (optional)</label>
            {isUsersLoading && <p className="text-sm text-gray-500">Loading users...</p>}
            {usersError && <p className="text-sm text-red-500">Error loading users</p>}
            {!isUsersLoading && users && (
              <Select
                options={options}
                onChange={handleAssigneeChange}
                placeholder="Select a user..."
                className="react-select-container"
                classNamePrefix="react-select"
                defaultValue={options.find((option: any) => option.value === assigneeId)}
              />
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Update Task
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </Layout>
  );
}
