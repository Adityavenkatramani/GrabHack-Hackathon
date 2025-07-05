import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Force splash screen to show for testing
    localStorage.removeItem('splashShown');
    const shouldShow = localStorage.getItem('splashShown') !== 'true';
    console.log('Splash screen should show:', shouldShow);
    return shouldShow;
  });
  const [splashVisible, setSplashVisible] = useState(showSplash);

  useEffect(() => {
    console.log('showSplash changed to:', showSplash);
    if (showSplash) {
      console.log('Starting splash screen timer');
      const timer = setTimeout(() => {
        console.log('Setting splashVisible to false');
        setSplashVisible(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleFadeOutEnd = () => {
    console.log('Splash fade out ended');
    setShowSplash(false);
    localStorage.setItem('splashShown', 'true');
  };

  console.log('Current state - showSplash:', showSplash, 'splashVisible:', splashVisible);

  return (
    <Router>
      {showSplash && (
        <SplashScreen visible={splashVisible} onFadeOutEnd={handleFadeOutEnd} />
      )}
      <div className={`transition-opacity duration-400 ${showSplash ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
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
