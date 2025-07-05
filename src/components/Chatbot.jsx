import React, { useState, useRef, useEffect } from "react";
import { IconSend } from "@tabler/icons-react";

const BOT_AVATAR = "/GrabVoyaige_logo1.png";
const USER_AVATAR =
  "https://ui-avatars.com/api/?name=You&background=34d399&color=fff&rounded=true";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // ✅ This is the new async function that sends message to Flask backend
const handleSendMessage = async () => {
  if (input.trim() === "") return;

  const userMessage = input;
  setInput(""); // Clear input

  try {
    const response = await fetch("http://127.0.0.1:5050/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    // Add both user message and bot reply together now
    setMessages(prevMessages => [
      ...prevMessages,
      { from: "user", text: userMessage },
      { from: "bot", text: data.reply }
    ]);
  } catch (error) {
    console.error("Error communicating with backend:", error);
    setMessages(prevMessages => [
      ...prevMessages,
      { from: "user", text: userMessage },
      { from: "bot", text: "Oops! Something went wrong." }
    ]);
  }
};


  return (
    <div className="w-full max-w-2xl h-[36rem] bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl flex flex-col border-2 border-green-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-green-100 bg-white rounded-t-3xl">
        <img
          src={BOT_AVATAR}
          alt="Bot"
          className="w-10 h-10 rounded-full border-2 border-green-200"
        />
        <div>
          <div className="font-semibold text-green-700">voyAIge Bot</div>
          <div className="text-xs text-green-500 flex items-center gap-1">
            <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Online
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-transparent">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            } animate-fade-in`}
          >
            {msg.from === "bot" && (
              <img
                src={BOT_AVATAR}
                alt="Bot"
                className="w-8 h-8 rounded-full border border-green-200"
              />
            )}
            <span
              className={
                msg.from === "user"
                  ? "bg-green-100 text-green-800 px-4 py-2 rounded-2xl rounded-br-sm shadow"
                  : "bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm border border-green-100 shadow"
              }
              style={{ maxWidth: "70%" }}
            >
              {msg.text}
            </span>
            {msg.from === "user" && (
              <img
                src={USER_AVATAR}
                alt="You"
                className="w-8 h-8 rounded-full border border-green-200"
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-green-100 bg-white rounded-b-3xl flex gap-2">
        <input
          className="flex-1 border border-green-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSendMessage();
          }}
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-full flex items-center justify-center hover:bg-green-700 transition shadow"
          onClick={handleSendMessage}
          aria-label="Send"
        >
          <IconSend size={22} />
        </button>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
