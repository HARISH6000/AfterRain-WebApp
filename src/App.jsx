import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import JournalHome from './components/JournalHome';
import BackgroundEffects from './components/BackgroundEffects';
import AmbientAudio from './components/AmbientAudio';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <BackgroundEffects />
      
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <JournalHome key="home" />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && <AmbientAudio key="audio" />}
      </AnimatePresence>
    </>
  );
}

export default App;
