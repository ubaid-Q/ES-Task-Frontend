import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const fetchUsers = async (token: string) => {
  const { data } = await axios.get(`${API_BASE}/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const createUser = async (token: string, userData: any) => {
  const { data } = await axios.post(`${API_BASE}/users`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const updateUser = async (token: string, id: string, userData: any) => {
  const { data } = await axios.put(`${API_BASE}/users/${id}`, userData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const deleteUser = async (token: string, id: string) => {
  const { data } = await axios.delete(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};
