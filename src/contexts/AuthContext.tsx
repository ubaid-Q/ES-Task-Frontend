"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login as loginApi, getProfile, register as registerApi } from "../api/auth";

interface AuthContextType {
  user: any;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const cookieToken = Cookies.get("token");
    const effectiveToken = storedToken || cookieToken;
    if (effectiveToken) {
      setToken(effectiveToken);
      getProfile()
        .then((data) => setUser(data))
        .catch(() => {
          setUser(null);
          setToken(null);
          localStorage.removeItem("token");
          Cookies.remove("token");
        });
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { access_token } = await loginApi({ username, password });
    setToken(access_token);
    localStorage.setItem("token", access_token);
    Cookies.set("token", access_token, { secure: false, sameSite: "lax" });
    const userData = await getProfile();
    setUser(userData);
    router.push("/");
  };

  const register = async (username: string, password: string) => {
    const { access_token } = await registerApi({ username, password });
    setToken(access_token);
    localStorage.setItem("token", access_token);
    Cookies.set("token", access_token, { secure: false, sameSite: "lax" });
    const userData = await getProfile();
    setUser(userData);
    router.push("/");
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    Cookies.remove("token");
    router.push("/auth/login");
  };

  return <AuthContext.Provider value={{ user, token, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
