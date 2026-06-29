import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import PiggyIllustration from './PiggyIllustration';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 3200);
    return () => clearTimeout(timer);
  }, [onFinish]);

  // Floating gold coin elements
  const coins = Array.from({ length: 12 });

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-piggy-light via-piggy-bg to-purple-50 dark:from-piggy-dark dark:via-[#1a1224] dark:to-piggy-dark overflow-hidden px-6"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Background Floating Coins Animation */}
      {coins.map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-gradient-to-br from-piggy-gold to-amber-500 shadow-gold-glow flex items-center justify-center font-bold text-white pointer-events-none"
          style={{
            width: `${Math.random() * 24 + 20}px`,
            height: `${Math.random() * 24 + 20}px`,
            left: `${Math.random() * 90 + 5}%`,
            top: `${Math.random() * 90 + 5}%`,
            fontSize: '12px'
          }}
          initial={{ y: 50, opacity: 0, rotate: 0 }}
          animate={{
            y: [-20, -100],
            opacity: [0, 0.8, 0],
            rotate: [0, 360],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut'
          }}
        >
          ₹
        </motion.div>
      ))}

      {/* Main Glassmorphism Card */}
      <motion.div
        className="glass-nav rounded-4xl p-10 max-w-sm w-full flex flex-col items-center text-center shadow-piggy-lg border border-white/60 dark:border-white/10 relative z-10"
        initial={{ scale: 0.8, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <PiggyIllustration size="lg" />
        </motion.div>

        <motion.h1
          className="text-3xl font-extrabold mt-6 bg-gradient-to-r from-piggy-pink via-piggy-purple to-amber-500 bg-clip-text text-transparent drop-shadow-sm tracking-tight"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Anna Ben Byju ❤️
        </motion.h1>

        <motion.p
          className="text-sm font-semibold text-gray-600 dark:text-gray-300 mt-2 tracking-wide px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Welcome, Anna! Every Rupee Counts ✨
        </motion.p>

        <motion.div
          className="w-16 h-1.5 bg-gradient-to-r from-piggy-pink to-piggy-purple rounded-full mt-6"
          initial={{ width: 0 }}
          animate={{ width: 64 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        />

        <button
          onClick={onFinish}
          className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold bg-piggy-pink/15 text-piggy-pink dark:text-piggy-light hover:bg-piggy-pink hover:text-white shadow-sm transition-all"
        >
          Tap to Open Anna's Piggy 🐷✨
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
