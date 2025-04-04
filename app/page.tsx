'use client';

import { useState } from "react";
import { Send, RefreshCcw, X, Menu, ChevronDown, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([
    { text: "Hi there! How can I assist you today?", sender: "bot" }
  ]);
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { text: input, sender: "user" };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          model: selectedModel
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        setMessages(prev => [...prev, { text: data.response, sender: "bot" }]);
      } else {
        setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: "bot" }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { text: "Sorry, I encountered an error. Please try again.", sender: "bot" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const refreshChat = () => {
    setMessages([{ text: "Hi there! How can I assist you today?", sender: "bot" }]);
    setInput("");
  };

  const clearChat = () => {
    const convoName = messages.length > 0 ? messages[0].text.slice(0, 20) : "New Chat";
    setConversations([...conversations, { name: convoName, messages }]);
    setMessages([{ text: "Hi there! How can I assist you today?", sender: "bot" }]);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setMessages([...messages, { text: `📎 ${file.name}`, sender: "user" }]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-blue-800 text-white p-4 flex flex-col transition-all ${sidebarOpen ? "w-64" : "w-16"}`}>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu size={18} />
        </Button>
        {sidebarOpen && (
          <>
            <div className="w-20 h-20 bg-gray-300 mx-auto rounded-full"></div>
            <h2 className="text-xl font-bold text-center mt-2">YUKTI YANTRA</h2>
            <Button 
              variant="ghost" 
              className="mt-4 flex items-center justify-between w-full"
              onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            >
              Select Model <ChevronDown size={18} />
            </Button>
            {modelDropdownOpen && (
              <div className="bg-white text-black p-2 mt-2 rounded-lg">
                <p className="cursor-pointer p-1 hover:bg-gray-200" onClick={() => setSelectedModel("gemini-1.5-flash")}>Gemini 1.5 Flash</p>
                <p className="cursor-pointer p-1 hover:bg-gray-200" onClick={() => setSelectedModel("gemini-pro")}>Gemini Pro</p>
              </div>
            )}
            <div className="mt-4">
              <h3 className="text-lg font-bold">Conversations</h3>
              <ul>
                {conversations.map((conv, index) => (
                  <li key={index} className="cursor-pointer p-1 hover:bg-gray-200" onClick={() => setMessages(conv.messages)}>
                    {conv.name}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </div>
      
      {/* Chat UI */}
      <div className={`flex flex-col items-center justify-center flex-1 p-4 transition-all ${sidebarOpen ? "ml-64" : "ml-16"}`}>
        <Card className="w-full h-full rounded-2xl shadow-lg bg-white flex flex-col">
          <CardContent className="p-4 flex flex-col flex-1">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                <span className="font-semibold">VISHWAMITRA 1.0</span>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={refreshChat}><RefreshCcw size={18} /></Button>
                <Button variant="ghost" size="icon" onClick={clearChat}><X size={18} /></Button>
              </div>
            </div>
            
            {/* Chat Messages */}
            <div className="flex flex-col gap-2 flex-1 overflow-y-auto py-2">
              {messages.map((msg, index) => (
                <div key={index} className={`px-3 py-2 rounded-lg max-w-[80%] ${msg.sender === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-black self-start"}`}>
                  {msg.text}
                </div>
              ))}
              {isLoading && (
                <div className="px-3 py-2 rounded-lg max-w-[80%] bg-gray-200 text-black self-start">
                  Thinking...
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="flex items-center gap-2 mt-2 border-t pt-2">
              <textarea
                className="flex-1 p-2 border rounded-lg resize-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={1}
              />
              <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <Button variant="ghost"><Paperclip size={18} /></Button>
              </label>
              <Button onClick={sendMessage} variant="ghost" disabled={isLoading}>
                <Send size={18} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 