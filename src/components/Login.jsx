import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const Login = ({ onLogin }) => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("Login Success");
      onLogin(codeResponse.access_token);
    },
    onError: (error) => console.log('Login Failed:', error),
    scope: 'https://www.googleapis.com/auth/drive.appdata',
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
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
        zIndex: 40,
      }}
    >
      <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', maxWidth: '450px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 200, marginBottom: '1rem' }}>
          AfterRain
        </h2>
        <p style={{ color: 'var(--color-text-secondary)', fontWeight: 300, marginBottom: '3rem', lineHeight: 1.6 }}>
          A quiet place for heavy nights. Sign in to keep your thoughts safely locked in your own Google Drive.
        </p>
        
        <button
          onClick={() => login()}
          className="glass-button"
          style={{
            padding: '1rem 2rem',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            width: '100%',
            background: 'rgba(255, 255, 255, 0.05)',
          }}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '24px', height: '24px' }} />
          Sign in with Google
        </button>
      </div>
    </motion.div>
  );
};

export default Login;
