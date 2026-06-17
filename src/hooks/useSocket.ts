import { useEffect, useState } from "react";

type Socket = {
  emit: (event: string, payload?: unknown) => void;
  on: (event: string, callback: (payload: unknown) => void) => void;
  off: (event: string, callback?: (payload: unknown) => void) => void;
  disconnect: () => void;
};

export function useSocket(conversationId: string | null, onIncomingMessage: (msg: any) => void) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    setSocket(null);
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
