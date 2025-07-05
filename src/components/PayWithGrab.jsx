import React from "react";

export default function PayWithGrab({ open, onClose, totalAmount }) {
  if (!open) return null;

  const handleViewOffers = () => {
    window.open("https://www.grab.com/sg/rewards/?utm_source=edm-inapp&utm_medium=edm-inapp&utm_campaign=SG19POINTSEXPIRYOPTOUT", "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 relative animate-fade-in-popup">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-green-600 text-2xl font-bold focus:outline-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
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
              onClick={onClose}
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
      </div>
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
      `}</style>
    </div>
  );
} 