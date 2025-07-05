import React, { useState } from "react";
import Chatbot from "../components/Chatbot";
import GrabPayPopup from "../components/GrabPayPopup";
import { IconCar, IconShieldCheck, IconCurrencyDollar, IconCreditCard, IconUser } from "@tabler/icons-react";

const FEATURES = [
  {
    icon: <IconCar className="w-8 h-8 text-green-600" />,
    title: "Book a Ride",
    desc: "Get a ride to your destination instantly."
  },
  {
    icon: <IconShieldCheck className="w-8 h-8 text-green-600" />,
    title: "Buy Insurance",
    desc: "Purchase travel insurance in seconds."
  },
  {
    icon: <IconCurrencyDollar className="w-8 h-8 text-green-600" />,
    title: "Check Loan",
    desc: "See if you qualify for instant travel loans."
  },
  {
    icon: <IconCreditCard className="w-8 h-8 text-green-600" />,
    title: "Pay with GrabPay",
    desc: "Make secure payments and earn rewards."
  }
];

const EXAMPLES = [
  "How do I book a ride to the airport?",
  "Show me travel insurance options",
  "Am I eligible for a travel loan?",
  "How do I pay with GrabPay?"
];

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [sendExample, setSendExample] = useState(null);
  const [showGrabPayPopup, setShowGrabPayPopup] = useState(false);

  // When a quick tip is clicked, prefill the chat input
  const handleExampleClick = (text) => {
    setSendExample(text);
    setInput(text);
  };

  const handleShowGrabPayPopup = () => setShowGrabPayPopup(true);

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 py-8 gap-8">
      {/* Left: Info/Features */}
      <div className="flex-1 flex flex-col items-center md:items-start gap-8 max-w-lg w-full mb-8 md:mb-0">
        <div className="flex items-center gap-3">
          <img src="/GrabVoyaige_logo1.png" alt="voyAIge logo" className="w-12 h-12 rounded-full border-2 border-green-200" />
          <div>
            <div className="text-2xl font-bold text-green-700">AI Concierge Chat</div>
            <div className="text-green-500 text-sm">Get instant help with your travel, finance, and more.</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 w-full">
          {FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl shadow p-4 border border-green-100">
              <span>{f.icon}</span>
              <div>
                <div className="font-semibold text-green-700">{f.title}</div>
                <div className="text-xs text-gray-500">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full">
          <div className="text-green-700 font-semibold mb-2">Try asking me:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex, i) => (
              <button
                key={i}
                className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm hover:bg-green-200 transition"
                onClick={() => handleExampleClick(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Right: Chatbot */}
      <div className="flex-1 flex items-center justify-center w-full max-w-4xl">
        <Chatbot initialInput={sendExample} onShowGrabPay={handleShowGrabPayPopup} userIcon={<IconUser className="w-8 h-8 text-green-400 bg-green-100 rounded-full p-1 border border-green-200" />} />
      </div>
      <GrabPayPopup open={showGrabPayPopup} onClose={() => setShowGrabPayPopup(false)} />
    </div>
  );
} 