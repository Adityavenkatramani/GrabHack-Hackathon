import React, { useState } from "react";

export default function PayWithGrab({ open, onClose, totalAmount, onPaymentComplete }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleViewOffers = () => {
    window.open("https://www.grab.com/sg/rewards/?utm_source=edm-inapp&utm_medium=edm-inapp&utm_campaign=SG19POINTSEXPIRYOPTOUT", "_blank");
  };

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  const handleDone = async () => {
    try {
      // Get user name from localStorage
      const userName = localStorage.getItem('userName') || 'User';
      
      // Send POST request to notify payment completion
      await fetch("http://127.0.0.1:5050/payment-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          user_name: userName,
          amount: totalAmount
        })
      });

      // Call the callback to add message to chat
      if (onPaymentComplete) {
        onPaymentComplete();
      }

      // Close the popup
      onClose();
    } catch (error) {
      console.error("Error notifying payment completion:", error);
      // Still close the popup even if the request fails
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-fade-in-popup flex flex-col items-center">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        {loading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-2"></div>
            <div className="text-lg font-semibold text-green-700">Payment under progress...</div>
          </div>
        ) : success ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-green-100 mb-2 animate-bounce-in">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-lg font-bold text-green-700">Payment is done!</div>
            <button
              className="bg-green-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition text-lg font-semibold mt-4"
              onClick={handleDone}
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-4">
              <img src="/GrabPay.png" alt="GrabPay" className="w-20 h-20 rounded-full shadow border-2 border-green-200" />
              <h2 className="text-2xl font-bold text-green-700">Pay with GrabPay</h2>
              <p className="text-gray-600 text-center mb-2">Complete your payment securely with GrabPay.</p>
              <div className="w-full flex flex-col items-center bg-green-50 rounded-xl p-4 mb-4">
                <span className="text-gray-500 text-sm">Total Amount</span>
                <span className="text-3xl font-bold text-green-700">${totalAmount.toFixed(2)}</span>
              </div>
              <div className="w-full bg-blue-50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-blue-600 font-semibold">🎁</span>
                  <span className="text-blue-700 font-semibold">Earn GrabRewards Points!</span>
                </div>
                <p className="text-blue-600 text-sm">Get 0.5% back in points when you pay with GrabPay Wallet</p>
              </div>
              <div className="w-full flex flex-col gap-3">
                <button 
                  className="bg-green-600 text-white px-6 py-3 rounded-full shadow hover:bg-green-700 transition w-full text-lg font-semibold"
                  onClick={handlePay}
                >
                  Confirm & Pay
                </button>
                <button 
                  className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition w-full text-lg font-semibold"
                  onClick={handleViewOffers}
                >
                  View Offers with Grab
                </button>
              </div>
              <div className="w-full text-center text-xs text-gray-500 mt-4">
                <p>Your points won't expire as long as you complete one transaction a month</p>
              </div>
            </div>
          </>
        )}
        <style>{`
          .animate-fade-in-popup {
            animation: fadeInPopup 0.5s cubic-bezier(0.4,0,0.2,1);
          }
          @keyframes fadeInPopup {
            0% { opacity: 0; transform: scale(0.92) translateY(40px); }
            60% { opacity: 1; transform: scale(1.04) translateY(-8px); }
            80% { transform: scale(0.98) translateY(2px); }
            100% { opacity: 1; transform: scale(1) translateY(0); }
          }
          .animate-bounce-in {
            animation: bounceIn 0.7s cubic-bezier(.4,0,.2,1);
          }
          @keyframes bounceIn {
            0% { opacity: 0; transform: scale(0.7); }
            60% { opacity: 1; transform: scale(1.15); }
            80% { transform: scale(0.95); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
} 