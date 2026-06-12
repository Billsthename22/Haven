"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const initialMessages = [
  {
    id: 1,
    sender: "other",
    text: "Hey 👋",
    time: "10:20 AM",
  },
  {
    id: 2,
    sender: "me",
    text: "Heyyy ❤️",
    time: "10:21 AM",
    seen: true,
  },
  {
    id: 3,
    sender: "other",
    text: "How's your day going?",
    time: "10:22 AM",
  },
  {
    id: 4,
    sender: "me",
    text: "Pretty good so far. Working on Safe Haven 😌",
    time: "10:23 AM",
    seen: true,
  },
];

export default function ChatRoomPage() {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: "me",
        text: newMessage,
        time: "Now",
        seen: false,
      },
    ]);

    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-white">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between px-4 py-4 border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <ArrowLeft className="cursor-pointer" size={22} />
          </Link>

          <div className="relative">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold">
              S
            </div>

            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border border-[#0B0F19]" />
          </div>

          <div>
            <h2 className="font-semibold">Sarah Johnson</h2>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Phone size={20} className="cursor-pointer" />
          <Video size={20} className="cursor-pointer" />
          <MoreVertical size={20} className="cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.sender === "me"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-3xl px-4 py-3 ${
                message.sender === "me"
                  ? "bg-gradient-to-r from-blue-600 to-purple-600"
                  : "bg-white/10 backdrop-blur-xl border border-white/10"
              }`}
            >
              <p className="text-sm">{message.text}</p>

              <div className="flex items-center justify-end gap-1 mt-2">
                <span className="text-[10px] opacity-70">
                  {message.time}
                </span>

                {message.sender === "me" &&
                  (message.seen ? (
                    <CheckCheck
                      size={12}
                      className="text-blue-200"
                    />
                  ) : (
                    <Check size={12} />
                  ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing Indicator */}
        <div className="flex justify-start">
          <div className="bg-white/10 border border-white/10 rounded-3xl px-4 py-3 backdrop-blur-xl">
            <div className="flex gap-1">
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-100" />
              <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce delay-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Input Bar */}
      <div className="relative z-10 border-t border-white/10 bg-black/20 backdrop-blur-xl p-4">
        <div className="flex items-center gap-3">
          <button className="text-gray-400 hover:text-white">
            <Paperclip size={22} />
          </button>

          <div className="flex-1 flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-4 py-3">
            <Smile size={20} className="text-gray-400" />

            <input
              value={newMessage}
              onChange={(e) =>
                setNewMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
              placeholder="Type a message..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500"
            />
          </div>

          {newMessage.trim() ? (
            <button
              onClick={sendMessage}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          ) : (
            <button className="h-12 w-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center">
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}