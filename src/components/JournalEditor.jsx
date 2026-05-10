import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Save, Clock } from 'lucide-react';

const MOODS = ['Calm', 'Tired', 'Lonely', 'Hopeful', 'Overwhelmed', 'Peaceful', 'Empty', 'Anxious'];

const JournalEditor = ({ entry, onBack, onSave, isSaving }) => {
  const [text, setText] = useState(entry?.text || '');
  const [mood, setMood] = useState(entry?.mood || '');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = async () => {
    const updatedEntry = {
      ...entry,
      text,
      mood,
      id: entry?.id || Date.now(),
      date: entry?.date || new Date().toISOString(),
      createdAt: entry?.createdAt || entry?.date || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await onSave(updatedEntry);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const formatLastUpdated = (dateStr) => {
    if (!dateStr) return null;
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '4rem',
        maxWidth: '1000px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <button 
          onClick={onBack}
          className="glass-button"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
        >
          <ChevronLeft size={18} />
          Back to Gallery
        </button>
        
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 300 }}>
            {entry?.id ? 'Edit Entry' : 'New Entry'}
          </h2>
          {(entry?.updatedAt || entry?.date) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end', color: 'var(--color-text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
              <Clock size={12} />
              Last updated: {formatLastUpdated(entry?.updatedAt || entry?.date)}
            </div>
          )}
        </div>
      </div>

      {/* Mood Selector */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 300 }}>
          How are you feeling right now?
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {MOODS.map(m => (
            <button
              key={m}
              className={`glass-button ${mood === m ? 'active' : ''}`}
              onClick={() => setMood(m === mood ? '' : m)}
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Writing Area */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2.5rem', position: 'relative' }}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Let the words flow..."
          style={{
            flex: 1,
            width: '100%',
            fontSize: '1.2rem',
            lineHeight: 1.8,
            fontWeight: 300,
          }}
        />
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1.5rem', marginTop: '1.5rem' }}>
          <AnimatePresence>
            {showSuccess && (
              <motion.span
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                style={{ color: 'var(--color-accent-teal)', fontSize: '0.9rem', fontWeight: 300 }}
              >
                Journal updated.
              </motion.span>
            )}
          </AnimatePresence>
          <button
            onClick={handleSave}
            disabled={isSaving || (!text.trim() && !mood)}
            className="glass-button"
            style={{ 
              padding: '0.8rem 2.5rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              opacity: (isSaving || (!text.trim() && !mood)) ? 0.5 : 1
            }}
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Entry'}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JournalEditor;
