"use client";
import React, { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { io, Socket } from "socket.io-client";
import throttle from "lodash/throttle";
import { useAuth } from "./AuthContext";

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notificationAudio, setNotificationAudio] = useState<any>(null);
  const hasUnlockedAudio = useRef(false);

  useEffect(() => {
    if (typeof Audio !== "undefined") {
      setNotificationAudio(new Audio("/sounds/notification.wav"));
    }
  }, []);

  const playNotification = throttle(
    () => {
      if (notificationAudio && hasUnlockedAudio.current) {
        notificationAudio.currentTime = 0;
        notificationAudio.play().catch((error: any) => console.error("Error playing notification sound:", error));
      }
    },
    1000,
    { trailing: false }
  );

  useEffect(() => {
    const unlockAudio = () => {
      if (notificationAudio) {
        notificationAudio
          .play()
          .then(() => {
            notificationAudio.pause();
            hasUnlockedAudio.current = true;
          })
          .catch(() => {});
      }
      document.body.removeEventListener("click", unlockAudio);
    };
    document.body.addEventListener("click", unlockAudio);
    return () => document.body.removeEventListener("click", unlockAudio);
  }, [notificationAudio]);

  useEffect(() => {
    if (!token) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";
    const newSocket = io(socketUrl, { auth: { token }, transports: ["websocket"] });
    setSocket(newSocket);

    const notifyEvents = ["task_assigned", "task_updated", "task_deleted"];

    newSocket.onAny((event, ...args) => {
      if (notifyEvents.includes(event)) {
        playNotification();
      }
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => newSocket.disconnect() as any;
  }, [token]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
