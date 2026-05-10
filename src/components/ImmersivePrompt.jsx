import React from 'react';
import { motion } from 'framer-motion';

const ImmersivePrompt = ({ onComplete }) => {
  const handleChoice = (isFullScreen) => {
    localStorage.setItem('afterrain_fullscreen_pref', isFullScreen ? 'true' : 'false');
    if (isFullScreen) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error('Error attempting to enable fullscreen:', e);
      });
    }
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050a10',
        zIndex: 50,
      }}
    >
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}
      >
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 300, marginBottom: '1.5rem', color: '#e2e8f0' }}>
          Immersive Mode
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem', fontWeight: 300, marginBottom: '3rem', lineHeight: 1.6 }}>
          For the deepest experience, AfterRain is best viewed in full screen. Would you like to enter immersive mode?
        </p>
        
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          <button 
            onClick={() => handleChoice(true)}
            className="glass-button"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            Enter Full Screen
          </button>
          <button 
            onClick={() => handleChoice(false)}
            className="glass-button"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Keep Windowed
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ImmersivePrompt;
