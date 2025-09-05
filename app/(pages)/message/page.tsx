"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { StatsAtom } from "@/store/ReminderStore";

type Chat = {
    id: number;
    name: string;
    lastMessage: string;
};

const chats: Chat[] = [
    { id: 0, name: "CoachAI", lastMessage: "Welcome! How can I help you today?" },
    { id: 1, name: "Counsellor Alice", lastMessage: "Hi, how are you feeling today?" },
    { id: 2, name: "Counsellor Bob", lastMessage: "Need support with anxiety?" },
    { id: 3, name: "Counsellor Carol", lastMessage: "Hello! Let's talk." },
];

export default function MessagesPage() {
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats,_] = useAtom(StatsAtom);

    const handleSelectChat = (chat: Chat) => {
        setActiveChat(chat);
        setMessages([{ sender: chat.name, text: chat.lastMessage }]);
    };

    const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement;
        if (!input.value || !activeChat) return;

        const userMessage = { sender: "You", text: input.value };
        setMessages((prev) => [...prev, userMessage]);
        input.value = "";

        // Only for CoachAI
        if (activeChat.id === 0) {
            setLoading(true);
            console.log(`${userMessage.text} 
   The following is my user's stat analyse and understand this to give user relevant answers if the user's queries concern the needs of this stat: 
   ${JSON.stringify(stats, null, 2)}`)
            try {
                const res = await fetch("/api/ai-chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ user_input: `${userMessage.text} 
   The following is my user's stat analyse and understand this to give user relevant answers if the user's queries concern the needs of this stat: 
   ${JSON.stringify(stats, null, 2)}`}),
                });

                const data = await res.json();
                const aiMessage = {
                    sender: "CoachAI",
                    text: data?.response || "Sorry, I didn't get that.",
                };
                setMessages((prev) => [...prev, aiMessage]);
            } catch (err) {
                const errorMsg = { sender: "CoachAI", text: "Error contacting AI server." };
                setMessages((prev) => [...prev, errorMsg]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="flex items-center justify-center px-4">
            <div className="flex w-full max-w-6xl h-[80vh] rounded-3xl shadow-2xl overflow-hidden">
                {/* Left Sidebar */}
                <div className="w-80 bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-l-3xl flex flex-col shadow-lg">
                    <h2 className="text-2xl text-zinc-100 font-bold p-4 border-b border-zinc-800">Chats</h2>
                    <div className="flex-1 overflow-y-auto">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => handleSelectChat(chat)}
                                className={`cursor-pointer text-zinc-100 p-4 border-b border-zinc-800 ${
                                    activeChat?.id === chat.id ? "bg-zinc-800/80 shadow-inner" : "hover:bg-zinc-800/50"
                                }`}
                            >
                                <div className="font-semibold">{chat.name}</div>
                                <div className="text-sm text-zinc-400">{chat.lastMessage}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Chat Panel */}
                <div className="flex-1 flex flex-col backdrop-blur-xl border border-zinc-800 rounded-r-3xl shadow-lg">
                    {activeChat ? (
                        <>
                            <div className="p-4 text-zinc-100 border-b border-zinc-800 font-bold text-lg">
                                Chat with {activeChat.name}
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                                {messages.map((msg, idx) => (
                                    <div
                                        key={idx}
                                        className={`max-w-xs px-4 py-2 text-zinc-100 rounded-2xl ${
                                            msg.sender === "You" ? "bg-cyan-600/90 ml-auto shadow-lg" : "bg-zinc-800/80 shadow-inner"
                                        }`}
                                    >
                                        <div className="text-sm font-semibold">{msg.sender}</div>
                                        <div>{msg.text}</div>
                                    </div>
                                ))}
                                {loading && <div className="text-zinc-400 text-sm">CoachAI is typing...</div>}
                            </div>
                            <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 flex gap-2">
                                <input
                                    type="text"
                                    name="message"
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 rounded-2xl text-zinc-200 bg-zinc-800/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-zinc-400"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 rounded-2xl bg-cyan-600/90 hover:bg-cyan-700 transition-colors disabled:opacity-50"
                                >
                                    Send
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-zinc-400 text-xl">
                            Select a chat to start messaging
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
