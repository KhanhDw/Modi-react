// src/hooks/useSocket.js
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";

export default function useSocket() {
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io(import.meta.env.VITE_MAIN_BE_URL, {
            withCredentials: true,
        });

        socketRef.current.on("connect", () => {
            console.log("✅ Socket connected:", socketRef.current.id);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    return socketRef.current;
}
