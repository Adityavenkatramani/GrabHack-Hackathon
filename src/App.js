import React, { useState, useEffect } from "react";
import LandingPage from './pages/LandingPage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setSplashVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleFadeOutEnd = () => setShowSplash(false);

  return (
    <>
      {showSplash && (
        <SplashScreen visible={splashVisible} onFadeOutEnd={handleFadeOutEnd} />
      )}
      <div className={showSplash ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>
        <LandingPage />
      </div>
    </>
  );
}

export default App;
