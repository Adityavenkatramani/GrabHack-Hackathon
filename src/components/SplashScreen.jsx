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
      className={`fixed inset-0 w-full h-full bg-green-600 z-50 flex items-center justify-center transition-opacity duration-700 ${fadeOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
      style={{ background: 'none', padding: 0, transition: 'opacity 0.7s, transform 0.7s' }}
    >
      <img
        src="/GrabVoyaige_logo1.png"
        alt="voyAIge logo"
        className="w-full h-full object-cover"
        style={{ maxWidth: '100vw', maxHeight: '100vh', transition: 'transform 0.7s' }}
      />
    </div>
  );
} 