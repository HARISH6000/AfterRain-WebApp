import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const AmbientAudio = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  
  useEffect(() => {
    // Initialize audio
    audioRef.current = new Audio('/cfl_turningpages-ink-amp-rain-zen-lofi-469329.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5; // Starts at 50% volume

    // Cleanup
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // Browsers may block auto-play, but this is triggered by a user click
      audioRef.current.play().catch(e => console.log('Audio playback prevented', e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3, duration: 2 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 100,
      }}
    >
      <button
        onClick={togglePlay}
        className="glass-button"
        style={{
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isPlaying ? 'rgba(254, 240, 138, 0.1)' : 'var(--color-surface-dark)',
          borderColor: isPlaying ? 'rgba(254, 240, 138, 0.3)' : 'rgba(255, 255, 255, 0.05)',
        }}
        title="Toggle Ambient Audio"
      >
        {isPlaying ? (
          <Volume2 size={20} color="var(--color-accent-tungsten)" />
        ) : (
          <VolumeX size={20} color="var(--color-text-secondary)" />
        )}
      </button>
    </motion.div>
  );
};

export default AmbientAudio;
