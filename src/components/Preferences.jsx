import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Maximize2, Minimize2, Volume2 } from 'lucide-react';

const Preferences = ({ onBack }) => {
  const [isFullScreen, setIsFullScreen] = useState(
    !!document.fullscreenElement
  );

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      setIsFullScreen(isFull);
      localStorage.setItem('afterrain_fullscreen_pref', isFull ? 'true' : 'false');
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '4rem',
        maxWidth: '800px',
        margin: '0 auto'
      }}
    >
      <button 
        onClick={onBack}
        className="glass-button"
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          alignSelf: 'flex-start', 
          marginBottom: '3rem', 
          padding: '0.5rem 1.25rem',
          fontSize: '0.9rem'
        }}
      >
        <ChevronLeft size={16} />
        Back to Journal
      </button>

      <div className="glass-panel" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>
          Preferences
        </h2>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              {isFullScreen ? <Minimize2 size={24} style={{ color: 'var(--color-accent-teal)' }} /> : <Maximize2 size={24} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>Immersive Mode</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Expand AfterRain to fill your entire screen.</p>
            </div>
          </div>
          <button 
            onClick={toggleFullScreen}
            className="glass-button"
            style={{ 
              padding: '0.6rem 1.8rem', 
              fontSize: '0.9rem',
              minWidth: '100px',
              background: isFullScreen ? 'rgba(45, 212, 191, 0.1)' : 'rgba(255,255,255,0.05)',
              borderColor: isFullScreen ? 'rgba(45, 212, 191, 0.3)' : 'rgba(255,255,255,0.1)',
              color: isFullScreen ? 'var(--color-accent-teal)' : 'var(--color-text-primary)'
            }}
          >
            {isFullScreen ? 'Active' : 'Enable'}
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
              <Volume2 size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 400, color: 'var(--color-text-primary)' }}>Audio Focus</h3>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Automatically pause audio when switching tabs.</p>
            </div>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Coming Soon</span>
        </div>
      </div>

      <div style={{ marginTop: 'auto', textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', fontWeight: 300 }}>
          Your preferences are saved locally to this browser.
        </p>
      </div>
    </motion.div>
  );
};

export default Preferences;
