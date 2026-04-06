"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url =
      process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:4000";

    const socket = io(url, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    socketRef.current = socket;
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.disconnect();
    };
  }, []);

  return { socketRef, connected };
}
