import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SplashScreen from './components/SplashScreen';
import JournalHome from './components/JournalHome';
import BackgroundEffects from './components/BackgroundEffects';
import AmbientAudio from './components/AmbientAudio';
import Login from './components/Login';
import ImmersivePrompt from './components/ImmersivePrompt';
import Preferences from './components/Preferences';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const [hasPrompted, setHasPrompted] = useState(() => !!localStorage.getItem('afterrain_fullscreen_pref'));
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('journal'); // 'journal' or 'preferences'
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('afterrain_token'));

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      // We update the preference if it exists, or just let it stay in sync with native state
      if (localStorage.getItem('afterrain_fullscreen_pref')) {
        localStorage.setItem('afterrain_fullscreen_pref', isFull ? 'true' : 'false');
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
        {!hasPrompted ? (
          <ImmersivePrompt key="prompt" onComplete={() => setHasPrompted(true)} />
        ) : showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !accessToken ? (
          <Login key="login" onLogin={handleLogin} />
        ) : currentView === 'preferences' ? (
          <Preferences key="preferences" onBack={() => setCurrentView('journal')} />
        ) : (
          <JournalHome 
            key="home" 
            accessToken={accessToken} 
            onLogout={handleLogout} 
            onOpenPreferences={() => setCurrentView('preferences')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && hasPrompted && <AmbientAudio key="audio" />}
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

export default App;
