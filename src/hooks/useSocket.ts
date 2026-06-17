import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(conversationId: string | null, onIncomingMessage: (msg: any) => void) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Connect to your Node.js/FastAPI running WebSocket server
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000");
    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket || !conversationId) return;

    // Join the specific room node
    socket.emit("join_room", { conversationId });

    // Listen for new payloads
    socket.on("new_message", onIncomingMessage);

    return () => {
      socket.off("new_message");
    };
  }, [socket, conversationId, onIncomingMessage]);

  return socket;
}