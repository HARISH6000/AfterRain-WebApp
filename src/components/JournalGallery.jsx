import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ChevronLeft, Calendar } from 'lucide-react';

const JournalGallery = ({ entries, onBack, onNewEntry, onEditEntry, onDeleteEntry, isFetching }) => {
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(d);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.8 }}
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        padding: '4rem',
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 10
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
        <button 
          onClick={onBack}
          className="glass-button"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.25rem' }}
        >
          <ChevronLeft size={18} />
          Back to Home
        </button>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 200 }}>Your Sanctuary</h2>
        <div style={{ width: '130px' }} /> {/* Spacer to center the title */}
      </div>

      {/* Gallery Grid */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '2rem',
        paddingRight: '1rem',
        paddingBottom: '4rem'
      }}>
        {/* "New Entry" Tile */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          onClick={onNewEntry}
          className="glass-panel"
          style={{
            height: '220px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            border: '2px dashed rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.02)'
          }}
        >
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.05)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <Plus size={24} />
          </div>
          <span style={{ fontWeight: 300, color: 'var(--color-text-secondary)' }}>New Journal Entry</span>
        </motion.div>

        {/* Existing Entries */}
        <AnimatePresence>
          {isFetching ? (
            <div key="loading" style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
              Fetching your history...
            </div>
          ) : (
            entries.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="glass-panel"
                style={{
                  height: '220px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onClick={() => onEditEntry(entry)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>
                    <Calendar size={14} />
                    {formatDate(entry.date || entry.createdAt)}
                  </div>
                  {entry.mood && (
                    <span style={{ 
                      fontSize: '0.7rem', 
                      color: 'var(--color-accent-teal)', 
                      border: '1px solid rgba(45, 212, 191, 0.3)', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {entry.mood}
                    </span>
                  )}
                </div>
                
                <p style={{ 
                  flex: 1, 
                  fontSize: '0.95rem', 
                  lineHeight: 1.6, 
                  color: 'var(--color-text-primary)', 
                  fontWeight: 300, 
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {entry.text || "No text content..."}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteEntry(entry.id);
                  }}
                  style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-muted)',
                    cursor: 'pointer',
                    padding: '0.5rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-text-muted)'}
                >
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JournalGallery;
