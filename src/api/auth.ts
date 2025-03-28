import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const login = async (credentials: { username: string; password: string }) => {
  const res = await axios.post(`${API_BASE}/auth/login`, credentials);
  return res.data;
};

export const register = async (credentials: { username: string; password: string }) => {
  const res = await axios.post(`${API_BASE}/auth/register`, credentials);
  return res.data;
};

export const logoutApi = async (token: string) => {
  const res = await axios.post(`${API_BASE}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const getProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API_BASE}/users/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
