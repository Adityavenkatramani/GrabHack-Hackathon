import React, { useState, useRef, useEffect } from "react";
import { IconSend, IconTrash } from "@tabler/icons-react";

const BOT_AVATAR = "/GrabVoyaige_logo1.png";
const USER_AVATAR =
  "https://ui-avatars.com/api/?name=You&background=34d399&color=fff&rounded=true";

export default function Chatbot({ onShowGrabPay, messages: propMessages, disableInput, userIcon, onPaymentComplete }) {
  const [messages, setMessages] = useState(propMessages || [
    { from: "bot", text: "Hi! I'm Columbus, your customer service rep here at VoyAIge. I'm here to help you take care of the boring tasks of your vacation planning, right from booking your flights and taxis to taking care of your payments. What can I help you with today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, propMessages]);

  const displayMessages = propMessages || messages;

  const handleSendMessage = async () => {
    if (input.trim() === "" || isLoading) return;

    const userMessage = input;
    setInput(""); // Clear input
    setIsLoading(true); // Start loading

    // Add user message immediately
    if (!propMessages) {
      setMessages(prevMessages => [
        ...prevMessages,
        { from: "user", text: userMessage }
      ]);
    }

    try {
      // Get user name from localStorage
      const userName = localStorage.getItem('userName') || 'User';
      
      const response = await fetch("http://127.0.0.1:5050/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          user_name: userName // Pass user name to Flask app
        })
      });

      const data = await response.json();

      if (!propMessages) {
        setMessages(prevMessages => [
          ...prevMessages,
          { from: "bot", text: data.reply }
        ]);
      }
    } catch (error) {
      console.error("Error communicating with backend:", error);
      if (!propMessages) {
        setMessages(prevMessages => [
          ...prevMessages,
          { from: "bot", text: "Oops! Something went wrong." }
        ]);
      }
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const handleClearChat = async () => {
    if (isClearing || isLoading) return;
    
    setIsClearing(true);
    
    try {
      // Get user name from localStorage
      const userName = localStorage.getItem('userName') || 'User';
      
      // Call the clear endpoint
      await fetch("http://127.0.0.1:5050/clear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_name: userName
        })
      });

      // Reset messages to initial state
      if (!propMessages) {
        setMessages([
          { from: "bot", text: "Hi! How can I help you today?" },
        ]);
      }
    } catch (error) {
      console.error("Error clearing chat:", error);
    } finally {
      setIsClearing(false);
    }
  };

  // Handle payment completion
  const handlePaymentComplete = async () => {
    try {
      // Get user name from localStorage
      const userName = localStorage.getItem('userName') || 'User';
      
      // Send a message to get the payment completion response from LangGraph
      const response = await fetch("http://127.0.0.1:5050/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: "payment_completed",
          user_name: userName
        })
      });

      const data = await response.json();

      if (!propMessages) {
        setMessages(prevMessages => [
          ...prevMessages,
          { from: "bot", text: data.reply }
        ]);
      }
    } catch (error) {
      console.error("Error getting payment completion message:", error);
    }
  };

  // Handle click on GrabPay link in bot reply
  const handleBotMessageClick = (e) => {
    if (e.target.classList.contains("grabpay-link")) {
      e.preventDefault();
      if (onShowGrabPay) onShowGrabPay();
    }
  };

  // Override the onPaymentComplete callback to use our local handler
  useEffect(() => {
    if (onPaymentComplete) {
      // Replace the callback with our local handler
      onPaymentComplete = handlePaymentComplete;
    }
  }, [onPaymentComplete]);

  return (
    <div className="w-full max-w-4xl min-w-[28rem] h-[44rem] bg-gradient-to-br from-green-50 to-white rounded-3xl shadow-2xl flex flex-col border-2 border-green-200 min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-green-100 bg-white rounded-t-3xl">
        <div className="flex items-center gap-3">
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
        
        {/* Clear Chat Button */}
        <button
          onClick={handleClearChat}
          disabled={isClearing || isLoading}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
            isClearing || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-red-50 text-red-600 hover:bg-red-100 hover:scale-105 focus:scale-105'
          }`}
          title="Clear chat history"
        >
          <IconTrash size={16} />
          <span className="text-sm font-medium">
            {isClearing ? 'Clearing...' : 'Clear Chat'}
          </span>
        </button>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 bg-transparent">
        {displayMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-end gap-2 ${
              msg.from === "user" ? "justify-end" : "justify-start"
            } animate-fade-in-bounce`}
          >
            {msg.from === "bot" && (
              <img
                src={BOT_AVATAR}
                alt="Bot"
                className="w-8 h-8 rounded-full border border-green-200"
              />
            )}
            {msg.from === "bot" ? (
              <span
                className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-sm border border-green-100 shadow"
                style={{ maxWidth: "70%" }}
                onClick={handleBotMessageClick}
                dangerouslySetInnerHTML={{ __html: msg.text }}
              />
            ) : (
              <span
                className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl rounded-br-sm shadow"
                style={{ maxWidth: "70%" }}
              >
                {msg.text}
              </span>
            )}
            {msg.from === "user" && (
              userIcon ? (
                <span>{userIcon}</span>
              ) : (
                <img
                  src={USER_AVATAR}
                  alt="You"
                  className="w-8 h-8 rounded-full border border-green-200"
                />
              )
            )}
          </div>
        ))}
        
        {/* Loading animation */}
        {isLoading && (
          <div className="flex items-end gap-2 justify-start animate-fade-in-bounce">
            <img
              src={BOT_AVATAR}
              alt="Bot"
              className="w-8 h-8 rounded-full border border-green-200"
            />
            <div className="bg-white px-4 py-2 rounded-2xl rounded-bl-sm border border-green-100 shadow">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {!disableInput && (
        <div className="p-4 border-t border-green-100 bg-white rounded-b-3xl flex gap-2">
          <input
            className="flex-1 border border-green-200 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 bg-green-50 transition-shadow duration-200 focus:shadow-green-200"
            type="text"
            placeholder={isLoading ? "Bot is typing..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) handleSendMessage();
            }}
            disabled={isLoading}
          />
          <button
            className={`px-4 py-2 rounded-full flex items-center justify-center transition shadow focus:outline-none ${
              isLoading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-110 focus:scale-110'
            }`}
            onClick={handleSendMessage}
            disabled={isLoading}
            aria-label="Send"
          >
            <IconSend size={22} />
          </button>
        </div>
      )}

      {/* Animations */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.4s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-bounce {
          animation: fadeInBounce 0.5s cubic-bezier(.4,0,.2,1);
        }
        @keyframes fadeInBounce {
          0% { opacity: 0; transform: translateY(30px) scale(0.95); }
          60% { opacity: 1; transform: translateY(-6px) scale(1.04); }
          80% { transform: translateY(2px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .grabpay-link {
          color: #059669;
          text-decoration: underline;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .grabpay-link:hover {
          color: #047857;
          text-decoration: none;
          background-color: #ecfdf5;
          padding: 2px 4px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
