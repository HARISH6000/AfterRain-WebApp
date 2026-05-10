import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Book, Settings, CloudRain } from 'lucide-react';

const Dashboard = ({ onOpenJournal, onOpenSettings }) => {
  const [time, setTime] = useState(new Date());

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

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
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
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Time & Weather Centerpiece */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1.5 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ 
          fontFamily: 'var(--font-display)', 
          fontSize: '8rem', 
          fontWeight: 200, 
          letterSpacing: '-0.05em',
          marginBottom: '0.5rem',
          color: 'var(--color-text-primary)'
        }}>
          {formatTime(time).split(' ')[0]}
          <span style={{ fontSize: '2rem', marginLeft: '0.5rem', verticalAlign: 'middle', fontWeight: 300 }}>
            {formatTime(time).split(' ')[1]}
          </span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-secondary)', fontWeight: 300, marginBottom: '2rem' }}>
          {formatDate(time)}
        </p>
        
        {/* Subtle Weather Info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', color: 'var(--color-text-secondary)' }}>
          <CloudRain size={20} />
          <span style={{ fontWeight: 300 }}>Light Rain • 18°C</span>
        </div>
      </motion.div>

      {/* Dock Area */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        style={{
          position: 'absolute',
          bottom: '4rem',
          display: 'flex',
          gap: '2rem'
        }}
      >
        <button 
          onClick={onOpenJournal}
          className="glass-button" 
          style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Journal"
        >
          <Book size={28} />
        </button>
        <button 
          onClick={onOpenSettings}
          className="glass-button" 
          style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Settings"
        >
          <Settings size={28} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
