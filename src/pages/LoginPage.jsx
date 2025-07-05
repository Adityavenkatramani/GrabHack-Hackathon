import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthPopup from "../components/AuthPopup";

const LANDING_URL = window.location.origin + "/";

export default function LoginPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginMethod, setLoginMethod] = useState("");
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (method) => {
    setLoginMethod(method);
    if (method === "grab") {
      setShowAuthPopup(true);
    } else {
      setTimeout(() => {
        setLoggedIn(true);
      }, 800); // Simulate login delay
    }
  };

  const handleAuthenticated = (userName) => {
    // Store user name in localStorage or state management for use in Flask app
    localStorage.setItem('userName', userName);
    navigate("/chat");
  };

  if (loggedIn) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-white px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center gap-8">
        <img src="/GrabVoyaige_logo1.png" alt="voyAIge logo" className="w-16 h-16 rounded-full border-2 border-green-200" />
        <h1 className="text-3xl font-bold text-green-700 text-center">Sign in to voyAIge</h1>
        <div className="flex flex-col gap-4 w-full">
          <button
            className="flex items-center justify-center gap-3 bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition text-lg font-semibold"
            onClick={() => handleLogin("grab")}
          >
            Continue with Grab
          </button>
          <button
            className="flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-800 px-6 py-3 rounded-full shadow hover:bg-gray-100 transition text-lg font-semibold"
            onClick={() => handleLogin("google")}
          >
            Continue with Google
          </button>
          <button
            className="flex items-center justify-center gap-3 bg-black text-white px-6 py-3 rounded-full shadow hover:bg-gray-900 transition text-lg font-semibold"
            onClick={() => handleLogin("apple")}
          >
            Continue with Apple ID
          </button>
        </div>
        <div className="w-full flex flex-col items-center gap-2 mt-6">
          <span className="text-gray-500 text-sm">Or scan to open on your phone</span>
          <div className="bg-white p-2 rounded-xl shadow border border-green-100">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(LANDING_URL)}`}
              alt="QR code for landing page"
              className="w-32 h-32"
            />
          </div>
          <span className="text-xs text-gray-400">Scan this QR code to open voyAIge on your mobile device</span>
        </div>
      </div>

      <AuthPopup 
        isOpen={showAuthPopup}
        onClose={() => setShowAuthPopup(false)}
        onAuthenticated={handleAuthenticated}
      />
    </div>
  );
} 