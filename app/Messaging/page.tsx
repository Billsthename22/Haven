"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  MessageCircle,
  MoreHorizontal,
  Edit3,
  Home,
  Users,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const onlineUsers = [
  { id: 1, name: "Sarah", avatar: "S", gradient: "from-pink-500 to-rose-500" },
  { id: 2, name: "David", avatar: "D", gradient: "from-blue-500 to-cyan-500" },
  { id: 3, name: "Anna", avatar: "A", gradient: "from-purple-500 to-indigo-500" },
  { id: 4, name: "Mike", avatar: "M", gradient: "from-amber-500 to-orange-500" },
  { id: 5, name: "Emma", avatar: "E", gradient: "from-emerald-500 to-teal-500" },
  { id: 6, name: "James", avatar: "J", gradient: "from-violet-500 to-fuchsia-500" },
];

const conversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    message: "Hey, are you free later? ❤️",
    time: "2m",
    unread: 3,
    online: true,
    avatarGradient: "from-pink-500 to-rose-500",
  },
  {
    id: 2,
    name: "David Parker",
    message: "Sent a photo 📸",
    time: "10m",
    unread: 0,
    online: false,
    avatarGradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    name: "Anna Williams",
    message: "Typing...",
    time: "15m",
    unread: 1,
    online: true,
    typing: true,
    avatarGradient: "from-purple-500 to-indigo-500",
  },
  {
    id: 4,
    name: "Michael Scott",
    message: "That sounds great 😂",
    time: "1h",
    unread: 0,
    online: false,
    avatarGradient: "from-amber-500 to-orange-500",
  },
  {
    id: 5,
    name: "Emma Stone",
    message: "Let's catch up tomorrow!",
    time: "2h",
    unread: 2,
    online: true,
    avatarGradient: "from-emerald-500 to-teal-500",
  },
];

export default function MessagesPage() {
  const [search, setSearch] = useState("");

  const filteredConversations = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(search.toLowerCase()) ||
      conversation.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 font-sans antialiased pb-32 relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        <div className="absolute top-0 left-[-5%] h-[350px] w-[350px] rounded-full bg-blue-600/[0.08] blur-[130px]" />
        <div className="absolute top-[20%] right-[-5%] h-[400px] w-[400px] rounded-full bg-purple-600/[0.08] blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 pt-8">
        
        {/* Header Component */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">Messages</h1>
            <p className="text-slate-400 text-xs md:text-sm mt-1.5">
              Stay connected with your Safe Haven circle
            </p>
          </div>

          <button className="relative p-2.5 rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.08] text-slate-300 hover:text-white transition-all duration-200 active:scale-95">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-[#080C14]" />
          </button>
        </header>

        {/* Input Search Module */}
        <div className="mb-8">
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] focus-within:bg-white/[0.04] focus-within:border-indigo-500/40 px-4 py-3 backdrop-blur-md transition-all duration-200">
            <Search size={18} className="text-slate-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-transparent outline-none text-sm text-white placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Online Carousels */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-sm tracking-wider uppercase text-slate-400">Online Now</h2>
            <button className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              View All
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none snap-x">
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex flex-col items-center gap-2 min-w-[64px] snap-start cursor-pointer group"
              >
                <div className="relative">
                  <div className={`h-14 w-14 rounded-full bg-gradient-to-br ${user.gradient} flex items-center justify-center font-bold text-base text-white shadow-lg shadow-black/20 transform group-hover:scale-105 transition-transform duration-200 ring-2 ring-white/[0.05]`}>
                    {user.avatar}
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#080C14]" />
                </div>
                <span className="text-xs font-medium text-slate-300 tracking-wide group-hover:text-white transition-colors truncate max-w-full">
                  {user.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Feed List Group */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="font-semibold text-sm tracking-wider uppercase text-slate-400">Recent Chats</h2>
          </div>
          
          <AnimatePresence initial={false}>
            {filteredConversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="group relative"
              >
                <button className="w-full rounded-2xl border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.05] focus:bg-white/[0.06] backdrop-blur-md p-3.5 transition-all duration-200 text-left flex items-center gap-4 outline-none">
                  
                  {/* Dynamic Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${conversation.avatarGradient} flex items-center justify-center font-bold text-white shadow-md shadow-black/10 transform group-hover:scale-102 transition-transform duration-200 ring-2 ring-white/[0.05]`}>
                      {conversation.name.charAt(0)}
                    </div>
                    {conversation.online && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-[#080C14]" />
                    )}
                  </div>

                  {/* Body Copy Column */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-semibold text-[15px] text-white tracking-wide truncate">
                        {conversation.name}
                      </h3>
                      <span className="text-[11px] text-slate-500 font-medium ml-2">
                        {conversation.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <p
                        className={`text-sm truncate pr-4 ${
                          conversation.typing
                            ? "text-indigo-400 font-medium animate-pulse"
                            : "text-slate-400"
                        }`}
                      >
                        {conversation.message}
                      </p>

                      {conversation.unread > 0 && (
                        <div className="flex-shrink-0 flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-sm shadow-indigo-600/20">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Options Trigger icon */}
                  <div className="flex-shrink-0 opacity-0 md:group-hover:opacity-100 transition-opacity duration-150 pl-1">
                    <div className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                      <MoreHorizontal size={16} />
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Empty State Interface */}
        {filteredConversations.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 px-4"
          >
            <div className="h-16 w-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
              <MessageCircle size={28} />
            </div>
            <h3 className="font-semibold text-base text-slate-200 mb-1">
              No conversations found
            </h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">
              We couldn't find matches for "{search}". Try checking your spelling or search for someone else.
            </p>
          </motion.div>
        )}
      </div>

      {/* Floating Interactive Trigger */}
      <button className="fixed bottom-24 right-6 h-14 w-14 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-indigo-600/20 flex items-center justify-center text-white hover:opacity-90 active:scale-95 transition-all z-20">
        <Edit3 size={20} />
      </button>

      {/* Persistent Bottom Bar Dock Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-white/[0.06] bg-[#080C14]/70 backdrop-blur-xl z-20">
        <div className="max-w-md mx-auto flex items-center justify-around py-2.5 px-2">
          
          <button className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all group">
            <Home size={18} className="group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">Home</span>
          </button>

          <button className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all group">
            <Users size={18} className="group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">Circles</span>
          </button>

          <button className="flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-indigo-400 bg-indigo-500/[0.06] font-medium transition-all relative">
            <MessageCircle size={18} />
            <span className="text-[10px] font-semibold tracking-wide">Chats</span>
            <span className="absolute top-1 right-4 h-1.5 w-1.5 bg-indigo-400 rounded-full" />
          </button>

          <button className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-slate-400 hover:text-white transition-all group">
            <User size={18} className="group-hover:scale-105 transition-transform" />
            <span className="text-[10px] font-medium tracking-wide">Profile</span>
          </button>
          
        </div>
      </nav>
    </div>
  );
}