import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import SplashScreen from './components/SplashScreen';
import Dashboard from './components/Dashboard';
import JournalGallery from './components/JournalGallery';
import JournalEditor from './components/JournalEditor';
import BackgroundEffects from './components/BackgroundEffects';
import LofiRadio from './components/LofiRadio';
import Login from './components/Login';
import ImmersivePrompt from './components/ImmersivePrompt';
import Preferences from './components/Preferences';
import { getJournalsFromDrive, saveJournalsToDrive } from './utils/driveSync';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const [hasPrompted, setHasPrompted] = useState(() => !!localStorage.getItem('afterrain_fullscreen_pref'));
  const [showSplash, setShowSplash] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'gallery' | 'editor' | 'preferences'
  const [accessToken, setAccessToken] = useState(() => localStorage.getItem('afterrain_token'));
  
  // Journal Data State
  const [entries, setEntries] = useState([]);
  const [fileId, setFileId] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!document.fullscreenElement;
      if (localStorage.getItem('afterrain_fullscreen_pref')) {
        localStorage.setItem('afterrain_fullscreen_pref', isFull ? 'true' : 'false');
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Fetch journals when logged in
  useEffect(() => {
    if (accessToken && hasPrompted && !showSplash) {
      const fetchFromCloud = async () => {
        setIsFetching(true);
        const data = await getJournalsFromDrive(accessToken);
        if (data.error && (data.error.message.includes('401') || data.error.message.includes('403'))) {
          handleLogout();
          return;
        }
        if (data.fileId) setFileId(data.fileId);
        if (data.entries) setEntries(data.entries);
        setIsFetching(false);
      };
      fetchFromCloud();
    }
  }, [accessToken, hasPrompted, showSplash]);

  const handleLogin = (token) => {
    localStorage.setItem('afterrain_token', token);
    setAccessToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('afterrain_token');
    setAccessToken(null);
    setEntries([]);
    setFileId(null);
  };

  const handleSaveEntry = async (updatedEntry) => {
    setIsSaving(true);
    let newEntries;
    const exists = entries.find(e => e.id === updatedEntry.id);
    
    if (exists) {
      newEntries = entries.map(e => e.id === updatedEntry.id ? updatedEntry : e);
    } else {
      newEntries = [updatedEntry, ...entries];
    }
    
    setEntries(newEntries);
    try {
      const newFileId = await saveJournalsToDrive(accessToken, fileId, newEntries);
      setFileId(newFileId);
    } catch (error) {
      console.error("Cloud Save Failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEntry = async (id) => {
    const newEntries = entries.filter(e => e.id !== id);
    setEntries(newEntries);
    try {
      await saveJournalsToDrive(accessToken, fileId, newEntries);
    } catch (error) {
      console.error("Cloud Delete Failed", error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <BackgroundEffects />
      
      <AnimatePresence mode="wait">
        {!hasPrompted ? (
          <ImmersivePrompt key="prompt" onComplete={() => setHasPrompted(true)} />
        ) : showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !accessToken ? (
          <Login key="login" onLogin={handleLogin} />
        ) : currentView === 'preferences' ? (
          <Preferences key="preferences" onBack={() => setCurrentView('dashboard')} />
        ) : currentView === 'gallery' ? (
          <JournalGallery 
            key="gallery"
            entries={entries}
            isFetching={isFetching}
            onBack={() => setCurrentView('dashboard')}
            onNewEntry={() => { setSelectedEntry(null); setCurrentView('editor'); }}
            onEditEntry={(entry) => { setSelectedEntry(entry); setCurrentView('editor'); }}
            onDeleteEntry={handleDeleteEntry}
          />
        ) : currentView === 'editor' ? (
          <JournalEditor 
            key="editor"
            entry={selectedEntry}
            isSaving={isSaving}
            onBack={() => setCurrentView('gallery')}
            onSave={handleSaveEntry}
          />
        ) : (
          <Dashboard 
            key="dashboard"
            onOpenJournal={() => setCurrentView('gallery')}
            onOpenSettings={() => setCurrentView('preferences')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showSplash && hasPrompted && <LofiRadio key="audio" isMinimal={currentView === 'editor'} />}
      </AnimatePresence>
    </GoogleOAuthProvider>
  );
}

export default App;
