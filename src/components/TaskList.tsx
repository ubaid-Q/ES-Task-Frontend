"use client";
import React, { Fragment, useEffect } from "react";
import Link from "next/link";
import { useQueryClient } from "react-query";
import toast from "react-hot-toast";
import { useTasks } from "@/hooks/useTask";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { EventType } from "@/model";
import { Menu, Transition } from "@headlessui/react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const statuses = ["pending", "in-progress", "completed"];

interface StatusDropdownProps {
  task: any;
  onStatusChange: (newStatus: string) => void;
}
const StatusDropdown: React.FC<StatusDropdownProps> = ({ task, onStatusChange }) => {
  const statusStyles: Record<string, string> = {
    pending: "bg-yellow-400 hover:bg-yellow-500 focus:ring-yellow-400",
    "in-progress": "bg-blue-400 hover:bg-blue-500 focus:ring-blue-400",
    completed: "bg-green-500 hover:bg-green-600 focus:ring-green-400",
  };

  const currentStatus = task.status.toLowerCase();
  const buttonStyle = statusStyles[currentStatus] || "bg-gray-500 hover:bg-gray-600 focus:ring-gray-400";

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className={classNames(
          "inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold text-white transition-colors duration-150 focus:outline-none focus:ring-2",
          buttonStyle
        )}
      >
        {task.status}
        <svg className="ml-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none z-10">
          {statuses.map((status) => (
            <Menu.Item key={status}>
              {({ active }) => (
                <button
                  onClick={() => onStatusChange(status)}
                  className={classNames(
                    active ? "bg-blue-500 text-white" : "text-gray-900",
                    "group flex w-full items-center px-4 py-2 text-sm"
                  )}
                >
                  {status}
                </button>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const TaskList: React.FC = () => {
  const { tasks, isLoading, error, deleteTask, updateTask } = useTasks();
  const { user } = useAuth();
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleTaskAssigned = (data: any) => {
      toast.success("A new task has been created!");
      queryClient.invalidateQueries("tasks");
    };

    const handleTaskUpdated = (data: any) => {
      toast.success("Task updated!");
      queryClient.invalidateQueries("tasks");
    };

    const handleTaskDeleted = (data: any) => {
      toast.success("Task deleted!");
      queryClient.invalidateQueries("tasks");
    };

    socket.on(EventType.TASK_ASSIGNED, handleTaskAssigned);
    socket.on(EventType.TASK_UPDATED, handleTaskUpdated);
    socket.on(EventType.TASK_DELETED, handleTaskDeleted);

    return () => {
      socket.off(EventType.TASK_ASSIGNED, handleTaskAssigned);
      socket.off(EventType.TASK_UPDATED, handleTaskUpdated);
      socket.off(EventType.TASK_DELETED, handleTaskDeleted);
    };
  }, [socket, queryClient]);

  if (isLoading) return <p className="text-center text-gray-600">Loading tasks...</p>;
  if (error) return <p className="text-center text-red-500">Error loading tasks.</p>;

  const handleStatusChange = async (task: any, newStatus: string) => {
    console.log({ task, newStatus });

    if (task.status.toLowerCase() === newStatus.toLowerCase()) return;
    try {
      await updateTask({ id: task.id, taskData: { status: newStatus } });
      toast.success("Status updated successfully");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        <Link href="/tasks/create">
          <button className="bg-green-500 hover:bg-green-600 focus:bg-green-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400">
            New Task
          </button>
        </Link>
      </div>
      {tasks && tasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {tasks.map((task: any) => (
            <div
              key={task.id}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-shadow duration-200 border border-gray-100"
            >
              <h3 className="text-xl font-extrabold text-gray-800 mb-2">{task.title}</h3>
              <p className="text-gray-700 mb-2">{task.description}</p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <span>
                  Status: <StatusDropdown task={task} onStatusChange={(newStatus) => handleStatusChange(task, newStatus)} />
                </span>
                {task.assignee && (
                  <span>
                    Assigned to: <span className="font-semibold">{task.assignee.username}</span>
                  </span>
                )}
              </div>
              <div className="mt-4 flex gap-4">
                {user.id === task.createdBy.id && (
                  <>
                    <Link href={`/tasks/${task.id}/edit`}>
                      <button className="bg-blue-500 hover:bg-blue-600 focus:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        Edit
                      </button>
                    </Link>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="bg-red-500 hover:bg-red-600 focus:bg-red-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No tasks available.</p>
      )}
    </div>
  );
};

export default TaskList;
