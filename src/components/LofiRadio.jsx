import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '../constants/stations';

const LofiRadio = () => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showControls, setShowControls] = useState(false);
  const audioRef = useRef(null);

  const currentStation = STATIONS[currentStationIndex];

  useEffect(() => {
    // Re-initialize audio when station changes
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(currentStation.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // We don't auto-play on station change unless already playing
    if (isPlaying) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.log('Playback prevented', e);
          setIsPlaying(false);
        });
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentStationIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => {
        console.log('Playback prevented', e);
        setIsPlaying(false);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const nextStation = () => {
    setCurrentStationIndex((prev) => (prev + 1) % STATIONS.length);
  };

  const prevStation = () => {
    setCurrentStationIndex((prev) => (prev - 1 + STATIONS.length) % STATIONS.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2, duration: 1 }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div 
        className="glass-panel" 
        style={{ 
          padding: '0.6rem 1rem', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1.25rem',
          borderRadius: 'var(--radius-full)',
          minWidth: showControls ? '340px' : 'auto',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="glass-button"
          style={{
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            background: isPlaying ? 'rgba(45, 212, 191, 0.15)' : 'rgba(255, 255, 255, 0.05)',
            borderColor: isPlaying ? 'rgba(45, 212, 191, 0.4)' : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {isPlaying ? <Volume2 size={18} color="var(--color-accent-teal)" /> : <VolumeX size={18} />}
        </button>

        {/* Station Info */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>
              {currentStation.name}
            </span>
            {/* Visualizer */}
            <div className="visualizer-container">
              <div className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
              <div className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
              <div className={`visualizer-bar ${isPlaying ? 'playing' : ''}`} />
            </div>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--color-text-secondary)', fontWeight: 300 }}>
            Lofi Station
          </span>
        </div>

        {/* Expanded Controls */}
        <AnimatePresence>
          {showControls && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto', paddingRight: '0.5rem' }}
            >
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={prevStation} 
                  className="glass-button" 
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Previous Station"
                >
                  <SkipBack size={14} />
                </button>
                <button 
                  onClick={nextStation} 
                  className="glass-button" 
                  style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Next Station"
                >
                  <SkipForward size={14} />
                </button>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  title="Volume"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default LofiRadio;
