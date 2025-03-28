import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchTask = async (taskId: string) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchTasks = async (token: string) => {
  const res = await axios.get(`${API_BASE}/tasks`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const createTask = async (token: string, taskData: any) => {
  const res = await axios.post(`${API_BASE}/tasks`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const updateTask = async (token: string, taskId: string, taskData: any) => {
  console.log({ taskId, taskData });

  const res = await axios.put(`${API_BASE}/tasks/${taskId}`, taskData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const deleteTask = async (token: string, taskId: string) => {
  const res = await axios.delete(`${API_BASE}/tasks/${taskId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
