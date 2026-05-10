import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ onComplete }) => {
  useEffect(() => {
    // Auto transition after 6.5 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 6500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Framer motion variants for cinematic text reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      }
    },
    exit: { 
      opacity: 0, 
      filter: 'blur(10px)',
      scale: 1.05,
      transition: { duration: 1.5, ease: "easeInOut" } 
    }
  };

  const titleText = "AfterRain";
  const titleLetters = Array.from(titleText);

  const letterVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition: { duration: 1.2, ease: [0.2, 0.65, 0.3, 0.9] } // Custom elegant ease
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, filter: 'blur(5px)', y: 20 },
    visible: { 
      opacity: 1, 
      filter: 'blur(0px)', 
      y: 0,
      transition: { delay: 2.5, duration: 2, ease: "easeOut" } 
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="splash-screen"
      onClick={onComplete}
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
        background: 'radial-gradient(circle at center, rgba(26, 34, 53, 0.4) 0%, rgba(10, 15, 26, 0.9) 100%)',
        backdropFilter: 'blur(4px)',
        WebkitBackdropFilter: 'blur(4px)',
        zIndex: 50,
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        {titleLetters.map((letter, index) => (
          <motion.h1
            key={index}
            variants={letterVariants}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '4.5rem',
              fontWeight: 200,
              letterSpacing: '0.1em',
              color: 'var(--color-text-primary)',
              textShadow: '0 0 30px rgba(254, 240, 138, 0.4)',
              marginRight: letter === ' ' ? '1rem' : '0'
            }}
          >
            {letter}
          </motion.h1>
        ))}
      </div>
      
      <motion.p
        variants={subtitleVariants}
        style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '1.2rem',
          fontWeight: 300,
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.1em',
          textTransform: 'lowercase',
        }}
      >
        a quiet place for heavy nights.
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
