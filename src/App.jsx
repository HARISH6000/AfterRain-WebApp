import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SplashScreen from './components/SplashScreen';
import JournalHome from './components/JournalHome';
import BackgroundEffects from './components/BackgroundEffects';
import AmbientAudio from './components/AmbientAudio';
import Login from './components/Login';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('afterrain_token'));

  const handleLogin = (token) => {
    localStorage.setItem('afterrain_token', token);
    setAccessToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('afterrain_token');
    setAccessToken(null);
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BackgroundEffects />
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !accessToken ? (
          <Login key="login" onLogin={handleLogin} />
        ) : (
          <JournalHome key="home" accessToken={accessToken} onLogout={handleLogout} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && <AmbientAudio key="audio" />}
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

export default App;
