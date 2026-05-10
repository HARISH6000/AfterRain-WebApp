import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, Settings, CloudRain, Clock as ClockIcon } from 'lucide-react';

const MOODS = ['Calm', 'Tired', 'Lonely', 'Hopeful', 'Overwhelmed', 'Peaceful', 'Empty', 'Anxious'];

const Dashboard = ({ onOpenJournal, onOpenSettings, onQuickJournal }) => {
  const [time, setTime] = useState(new Date());
  const [selectedMood, setSelectedMood] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setShowPrompt(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        zIndex: 10,
        padding: '2.5rem' // Standard margin
      }}
    >
      {/* Top Header Row (Greeting + Dock) */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '2rem'
      }}>
        {/* Indented Greeting + Time/Weather Cluster */}
        <div style={{ marginLeft: '2rem' }}>
          <motion.h2
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }} // Relaxed duration
            style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '2.5rem', 
              fontWeight: 300, 
              color: 'var(--color-text-primary)',
              margin: 0,
              marginBottom: '0.75rem'
            }}
          >
            {getGreeting()}
          </motion.h2>

          {/* Thin faint line */}
          <motion.div 
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 0.15 }}
            transition={{ delay: 1, duration: 3 }}
            style={{ 
              height: '1px', 
              width: '100%', 
              background: 'white', 
              transformOrigin: 'left',
              marginBottom: '1rem'
            }} 
          />

          {/* Time & Weather - Now under greeting */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 2.5 }}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-start', 
              gap: '2rem', 
              color: 'var(--color-text-muted)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ClockIcon size={14} />
              <span style={{ fontWeight: 300, fontSize: '0.85rem', letterSpacing: '0.05em' }}>{formatTime(time)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CloudRain size={14} />
              <span style={{ fontWeight: 300, fontSize: '0.85rem' }}>Light Rain • 18°C</span>
            </div>
          </motion.div>
        </div>

        {/* Dock - aligned to top right base padding */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={onOpenJournal}
            className="glass-button" 
            style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Journal Gallery"
          >
            <Book size={20} />
          </button>
          <button 
            onClick={onOpenSettings}
            className="glass-button" 
            style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Settings"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Interactive Session - Indented to match (4.5rem total from edge) */}
      <div style={{ textAlign: 'left', maxWidth: '600px', marginLeft: '2rem', marginTop: '0.5rem' }}>
        <motion.p
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 2.5, duration: 2.5, ease: "easeOut" }} // Slow, relaxed
          style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 300, marginBottom: '2rem' }}
        >
          How does the rain feel tonight?
        </motion.p>

        {/* Mood Selector */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 3, duration: 2.5 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'flex-start', marginBottom: '2rem' }}
        >
          {MOODS.map(m => (
            <button
              key={m}
              className={`glass-button mood-btn`}
              onClick={() => handleMoodSelect(m)}
              style={{ padding: '0.4rem 1.25rem', fontSize: '0.85rem' }}
            >
              {m}
            </button>
          ))}
        </motion.div>

        {/* Dynamic Prompt */}
        <div style={{ height: '3rem', marginBottom: '2rem' }}>
          <AnimatePresence>
            {showPrompt && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 1.5 }} // Relaxed prompt appearance
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', justifyContent: 'flex-start' }}
              >
                <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: 300 }}>
                  Write about it?
                </span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => onQuickJournal(selectedMood)}
                    className="glass-button" 
                    style={{ padding: '0.4rem 1.5rem', fontSize: '0.8rem', borderColor: 'var(--color-accent-teal)' }}
                  >
                    Yes
                  </button>
                  <button 
                    onClick={() => { setShowPrompt(false); setSelectedMood(null); }}
                    className="glass-button" 
                    style={{ padding: '0.4rem 1.5rem', fontSize: '0.8rem' }}
                  >
                    No
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
