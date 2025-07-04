import React from "react";

export default function SplashScreen() {
  return (
    <div
      className="fixed inset-0 w-full h-full bg-green-600 z-50 transition-opacity duration-700 flex items-center justify-center"
      style={{ background: 'none', padding: 0 }}
    >
      <img
        src="/GrabVoyaige_logo1.png"
        alt="voyAIge logo"
        className="w-full h-full object-cover"
        style={{ maxWidth: '100vw', maxHeight: '100vh' }}
      />
    </div>
  );
} 