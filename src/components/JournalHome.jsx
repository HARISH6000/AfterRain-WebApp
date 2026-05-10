import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MOODS = ['Calm', 'Tired', 'Lonely', 'Hopeful', 'Overwhelmed', 'Peaceful', 'Empty', 'Anxious'];

const JournalHome = () => {
  const [entries, setEntries] = useState([]);
  const [currentText, setCurrentText] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('afterrain_entries');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse entries', e);
      }
    }
  }, []);

  const handleSave = () => {
    if (!currentText.trim() && !selectedMood) return;
    
    setIsSaving(true);
    
    const newEntry = {
      id: Date.now(),
      text: currentText,
      mood: selectedMood,
      date: new Date().toISOString(),
    };

    const updatedEntries = [newEntry, ...entries];
    
    // Simulate a slow, comforting save
    setTimeout(() => {
      setEntries(updatedEntries);
      localStorage.setItem('afterrain_entries', JSON.stringify(updatedEntries));
      setCurrentText('');
      setSelectedMood('');
      setIsSaving(false);
    }, 1500);
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      month: 'short',
      day: 'numeric'
    }).format(d);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeInOut" }}
      style={{
        position: 'relative',
        zIndex: 10,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        padding: '4rem',
        gap: '4rem',
        maxWidth: '1600px',
        margin: '0 auto'
      }}
    >
      {/* Main Journal Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>
            Good evening.
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontWeight: 300 }}>
            Take a deep breath. The night is yours.
          </p>
        </motion.div>

        {/* Mood Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          style={{ marginBottom: '2rem' }}
        >
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 300 }}>
            How does the rain feel tonight?
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {MOODS.map(mood => (
              <button
                key={mood}
                className={`glass-button ${selectedMood === mood ? 'active' : ''}`}
                onClick={() => setSelectedMood(mood === selectedMood ? '' : mood)}
                style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
              >
                {mood}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Writing Area */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 2 }}
          className="glass-panel"
          style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', position: 'relative' }}
        >
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="Write what the rain couldn't wash away..."
            style={{
              flex: 1,
              width: '100%',
              fontSize: '1.1rem',
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <AnimatePresence>
              {(currentText.trim() || selectedMood) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={handleSave}
                  disabled={isSaving}
                  className="glass-button"
                  style={{ 
                    padding: '0.75rem 2rem', 
                    opacity: isSaving ? 0.5 : 1,
                    pointerEvents: isSaving ? 'none' : 'auto'
                  }}
                >
                  {isSaving ? 'Letting go...' : 'Keep this thought'}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Sidebar - Recent Entries */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2, duration: 1.5 }}
        style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--color-text-secondary)', paddingLeft: '1rem' }}>
          Past Nights
        </h3>
        
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <AnimatePresence>
            {entries.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                style={{ padding: '2rem 1rem', color: 'var(--color-text-muted)', textAlign: 'center', fontStyle: 'italic', fontWeight: 300 }}
              >
                It's quiet here.
              </motion.div>
            ) : (
              entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  layout
                  className="glass-panel"
                  style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>
                      {formatDate(entry.date)}
                    </span>
                    {entry.mood && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-accent-teal)', border: '1px solid rgba(45, 212, 191, 0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  {entry.text && (
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--color-text-primary)', fontWeight: 300, whiteSpace: 'pre-wrap' }}>
                      {entry.text}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JournalHome;
