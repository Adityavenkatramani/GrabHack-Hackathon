import React, { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
  };

  return (
    <div className="w-full max-w-2xl h-[36rem] bg-white rounded-xl shadow-xl flex flex-col border-2 border-green-200">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div key={idx} className={`mb-2 text-sm ${msg.from === "user" ? "text-right" : "text-left"}`}>
            <span className={msg.from === "user" ? "bg-green-100 text-green-800 px-3 py-1 rounded-lg inline-block" : "bg-gray-100 text-gray-800 px-3 py-1 rounded-lg inline-block"}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="p-2 border-t flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-400"
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
        />
        <button
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
} 