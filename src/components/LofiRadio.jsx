import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { STATIONS } from '../constants/stations';

const LofiRadio = () => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  const currentStation = STATIONS[currentStationIndex];
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    audioRef.current = new Audio(currentStation.url);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '2.5rem',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <motion.div 
        className="glass-panel" 
        animate={{ 
          width: isHovered ? '400px' : '220px', // Slightly wider default to prevent clipping
        }}
        transition={{ duration: 1, ease: "easeInOut" }}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 0.75rem',
          height: '56px', // Fixed height for perfect vertical centering
          gap: '1rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Play/Pause Button (Speaker) */}
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

        {/* Station Info (Always visible by default) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1 }}>
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--color-text-primary)', letterSpacing: '0.02em' }}>
                {currentStation.name}
              </span>
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

          {/* Controls - Only show on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 1, ease: "easeInOut" }} // Slow, smooth reveal
                style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginLeft: 'auto', paddingRight: '0.5rem' }}
              >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevStation(); }} 
                    className="glass-button" 
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <SkipBack size={14} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextStation(); }} 
                    className="glass-button" 
                    style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <SkipForward size={14} />
                  </button>
                </div>
                
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={volume} 
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LofiRadio;
