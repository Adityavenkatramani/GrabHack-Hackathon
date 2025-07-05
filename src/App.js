import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    return localStorage.getItem('splashShown') !== 'true';
  });
  const [splashVisible, setSplashVisible] = useState(showSplash);

  useEffect(() => {
    if (showSplash) {
      const timer = setTimeout(() => setSplashVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleFadeOutEnd = () => {
    setShowSplash(false);
    localStorage.setItem('splashShown', 'true');
  };

  return (
    <Router>
      {showSplash && (
        <SplashScreen visible={splashVisible} onFadeOutEnd={handleFadeOutEnd} />
      )}
      <div className={showSplash ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/*" element={<LandingPage animateOnLoad={!showSplash} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
