import React, { useState, useEffect } from "react";
import LandingPage from './pages/LandingPage';
import SplashScreen from './components/SplashScreen';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && <SplashScreen />}
      <div className={showSplash ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-700"}>
        <LandingPage />
      </div>
    </>
  );
}

export default App;
