import React, { useState } from "react";
import PayWithGrab from "./PayWithGrab";

const paymentOptions = [
  {
    key: "grabpay",
    name: "GrabPay",
    img: "/Grab_logo.png",
    description: "Fast, secure, and hassle-free payments with GrabPay."
  },
  {
    key: "paypal",
    name: "PayPal",
    img: "https://www.paypalobjects.com/webstatic/icon/pp258.png",
    description: "Pay easily with your PayPal account."
  },
  {
    key: "applepay",
    name: "Apple Pay",
    img: "/Apple.png",
    description: "Use Apple Pay for quick, private payments."
  }
];

export default function GrabPayPopup({ open, onClose, onPaymentComplete }) {
  const [selected, setSelected] = useState("grabpay");
  const [showGrabPay, setShowGrabPay] = useState(false);
  const [otherMsg, setOtherMsg] = useState("");

  const handleProceed = () => {
    if (selected === "grabpay") {
      setShowGrabPay(true);
    } else {
      setOtherMsg(`Redirecting to ${selected === "paypal" ? "PayPal" : "Apple Pay"}... (not implemented)`);
      setTimeout(() => setOtherMsg(""), 2000);
    }
  };

  return (
    <>
      {open && !showGrabPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-fade-in-popup">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Choose Payment Service</h2>
            <div className="flex flex-col gap-4 w-full">
              {paymentOptions.map(opt => (
                <button
                  key={opt.key}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition shadow-sm w-full text-left focus:outline-none ${selected === opt.key ? "border-green-600 bg-green-50" : "border-gray-200 bg-white hover:bg-green-50"}`}
                  onClick={() => setSelected(opt.key)}
                >
                  <img src={opt.img} alt={opt.name} className="w-12 h-12 rounded-full border border-green-200 bg-white object-contain" />
                  <div>
                    <div className="font-semibold text-lg text-green-700">{opt.name}</div>
                    <div className="text-gray-500 text-sm">{opt.description}</div>
                  </div>
                </button>
              ))}
            </div>
            <button
              className="mt-6 bg-green-600 text-white px-6 py-2 rounded-full shadow hover:bg-green-700 transition w-full text-lg font-semibold"
              onClick={handleProceed}
            >
              Proceed with {paymentOptions.find(opt => opt.key === selected).name}
            </button>
            {otherMsg && <div className="mt-4 text-center text-green-700 font-semibold">{otherMsg}</div>}
          </div>
          <style>{`
            .animate-fade-in-popup {
              animation: fadeInPopup 0.4s cubic-bezier(0.4,0,0.2,1);
            }
            @keyframes fadeInPopup {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
      <PayWithGrab 
        open={showGrabPay} 
        onClose={() => { setShowGrabPay(false); onClose(); }} 
        totalAmount={199.99} 
        onPaymentComplete={onPaymentComplete}
      />
    </>
  );
} 