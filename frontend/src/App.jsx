import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import FloatingBackground from './components/FloatingBackground';
import SplashScreen from './components/SplashScreen';
import BottomNav from './components/BottomNav';

import Dashboard from './pages/Dashboard';
import AddMoney from './pages/AddMoney';
import History from './pages/History';
import Statistics from './pages/Statistics';
import Goals from './pages/Goals';
import Settings from './pages/Settings';

const PageContent = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/add" element={<AddMoney />} />
        <Route path="/history" element={<History />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <Router>
      <div className="min-h-screen relative font-sans text-piggy-dark dark:text-white overflow-x-hidden">
        {/* Global Floating Background Ambient & Coins */}
        <FloatingBackground />

        {/* Toast Notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#121212',
              backdropFilter: 'blur(16px)',
              borderRadius: '24px',
              padding: '12px 20px',
              fontWeight: '600',
              boxShadow: '0 15px 30px -10px rgba(255, 92, 168, 0.25)',
              border: '1px solid rgba(255, 92, 168, 0.3)',
              fontSize: '13px'
            },
          }}
        />

        {/* Splash Screen Intro */}
        <AnimatePresence>
          {showSplash && (
            <SplashScreen onFinish={() => setShowSplash(false)} />
          )}
        </AnimatePresence>

        {/* Main Routed Content */}
        {!showSplash && (
          <>
            <main className="relative z-10 min-h-screen">
              <PageContent />
            </main>
            <BottomNav />
          </>
        )}
      </div>
    </Router>
  );
};

export default App;
