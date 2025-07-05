import React, { useEffect, useState } from "react";

export default function SplashScreen({ visible = true, onFadeOutEnd }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!visible) {
      setFadeOut(true);
      const timer = setTimeout(() => {
        if (onFadeOutEnd) onFadeOutEnd();
      }, 700); // match duration
      return () => clearTimeout(timer);
    }
  }, [visible, onFadeOutEnd]);

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-gradient-to-br from-green-600 to-green-700 z-[9999] flex items-center justify-center transition-all duration-700 ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6 animate-pulse">
        <img
          src="/GrabVoyaige_logo1.png"
          alt="voyAIge logo"
          className="w-32 h-32 rounded-full border-4 border-white shadow-2xl"
        />
        <div className="text-white text-2xl font-bold">voyAIge</div>
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
} 