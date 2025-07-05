import React, { useEffect, useState } from "react";

export default function SplashScreen({ visible = true, onFadeOutEnd }) {
  const [fadeOut, setFadeOut] = useState(false);

  console.log('SplashScreen rendered with visible:', visible, 'fadeOut:', fadeOut);

  useEffect(() => {
    console.log('SplashScreen useEffect - visible changed to:', visible);
    if (!visible) {
      console.log('Starting fade out animation');
      setFadeOut(true);
      const timer = setTimeout(() => {
        console.log('Fade out animation completed, calling onFadeOutEnd');
        if (onFadeOutEnd) onFadeOutEnd();
      }, 400); // Reduced from 700ms to 400ms
      return () => clearTimeout(timer);
    }
  }, [visible, onFadeOutEnd]);

  return (
    <div
      className={`fixed inset-0 w-full h-full bg-green-600 z-[9999] flex items-center justify-center transition-all duration-400 ${
        fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <img
        src="/GrabVoyaige_logo1.png"
        alt="voyAIge logo"
        className="w-full h-full object-cover"
        style={{ maxWidth: '100vw', maxHeight: '100vh', transition: 'transform 0.4s' }}
      />
    </div>
  );
} 