"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft } from "lucide-react";
import SearchBar from "@/components/SearchBar";

interface ChatItem {
    id: string;
    sender: "AI" | "Counselor";
    lastMessage: string;
}

interface Message {
    sender: "AI" | "User" | "Counselor";
    text: string;
}

const chats: ChatItem[] = [
    { id: "1", sender: "AI", lastMessage: "Hi! How are you feeling today?" },
    { id: "2", sender: "Counselor", lastMessage: "Remember to take deep breaths." },
    { id: "3", sender: "Counselor", lastMessage: "How did your journaling go?" },
];

const ChatList: React.FC = () => {
    const [activeChat, setActiveChat] = useState<ChatItem | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Gemini API configuration
    const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const openChat = (chat: ChatItem) => {
        setActiveChat(chat);
        setMessages([
            { sender: chat.sender === "AI" ? "AI" : "Counselor", text: chat.lastMessage },
        ]);
    };

    const callGeminiAPI = async (userMessage: string): Promise<string> => {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `You are Wellify AI, a supportive and empathetic mental health assistant. Please respond to this message in a caring and helpful way: "${userMessage}"`
                                }
                            ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    },
                    safetySettings: [
                        {
                            category: "HARM_CATEGORY_HARASSMENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_HATE_SPEECH",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        },
                        {
                            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                            threshold: "BLOCK_MEDIUM_AND_ABOVE"
                        }
                    ]
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Invalid response structure');
            }
        } catch (error) {
            console.error('Gemini API Error:', error);
            return "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";
        }
    };

    const sendMessage = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput("");

        // Add user message
        setMessages((prev) => [...prev, { sender: "User", text: userMessage }]);
        setIsLoading(true);

        try {
            if (activeChat?.sender === "AI") {
                // Call Gemini API for AI responses
                const aiResponse = await callGeminiAPI(userMessage);
                setMessages((prev) => [...prev, { sender: "AI", text: aiResponse }]);
            } else {
                // Simulate counselor response
                setTimeout(() => {
                    const counselorResponse = "Thank you for sharing. I'm here to support you through this. Would you like to explore this feeling further?";
                    setMessages((prev) => [...prev, { sender: "Counselor", text: counselorResponse }]);
                    setIsLoading(false);
                }, 1500);
                return;
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessages((prev) => [...prev, {
                sender: "AI",
                text: "I apologize, but I'm experiencing technical difficulties. Please try again."
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="h-screen flex flex-col">
            <div className="mb-4">
                <SearchBar message={"Search for messages..."}/>
            </div>
            {!activeChat ? (
                // Show chat list
                <div className="flex-1 overflow-y-auto px-2">
                    <div className="flex flex-col gap-3">
                        {chats.map((chat) => (
                            <Card key={chat.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => openChat(chat)}>
                                <CardHeader>
                                    <CardTitle className="text-lg">
                                        {chat.sender === "AI" ? "Wellify AI" : "Counselor"}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-sm text-gray-600">
                                        {chat.lastMessage}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            ) : (
                // Show chat interface
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b bg-white">
                        <Button variant="ghost" size="sm" onClick={() => setActiveChat(null)}>
                            <ArrowLeft size={20} />
                        </Button>
                        <h2 className="text-lg font-semibold">
                            {activeChat.sender === "AI" ? "Wellify AI" : "Counselor"}
                        </h2>
                    </div>

                    {/* Messages container */}
                    <div className="flex-1 overflow-y-auto p-4 pb-20">
                        <div className="flex flex-col gap-3">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === "User" ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                                            msg.sender === "User"
                                                ? "bg-blue-500 text-white"
                                                : msg.sender === "AI"
                                                    ? "bg-green-100 text-gray-800"
                                                    : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        <span className="text-sm whitespace-pre-wrap">{msg.text}</span>
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-100"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-200"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Sticky input bar above bottom nav */}
                    <div className="fixed left-0 right-0 bottom-32 bg-white border-t p-4 shadow-lg">
                        <div className="flex gap-2 max-w-full">
        <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none min-h-[40px] max-h-[120px]"
            rows={1}
            disabled={isLoading}
        />
                            <Button
                                onClick={sendMessage}
                                disabled={!input.trim() || isLoading}
                                className="self-end"
                            >
                                <Send size={16} />
                            </Button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
};

export default ChatList;