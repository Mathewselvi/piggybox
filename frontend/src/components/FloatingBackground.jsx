import React from 'react';
import { motion } from 'framer-motion';

const FloatingBackground = () => {
  // Generate random floating coins/sparkles
  const particles = Array.from({ length: 8 });

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft Ambient Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-piggy-pink/15 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-1/3 -right-32 w-80 h-80 bg-piggy-purple/10 rounded-full blur-3xl animate-float" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-piggy-gold/15 rounded-full blur-3xl animate-float-slow" />

      {/* Floating Golden Coin Particles */}
      {particles.map((_, i) => {
        const size = Math.random() * 16 + 12;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        const delay = Math.random() * 5;

        return (
          <motion.div
            key={i}
            className="absolute rounded-full border border-piggy-gold/40 bg-gradient-to-br from-piggy-gold/30 to-piggy-pink/20 shadow-gold-glow backdrop-blur-sm flex items-center justify-center font-bold text-[10px] text-piggy-gold/60"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${left}%`,
              bottom: '-50px',
            }}
            animate={{
              y: [-10, -900],
              x: [0, (i % 2 === 0 ? 40 : -40), 0],
              rotate: [0, 360],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              delay: delay,
              ease: 'easeInOut',
            }}
          >
            ₹
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingBackground;
