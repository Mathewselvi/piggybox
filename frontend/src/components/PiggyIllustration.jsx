import React, { useState } from 'react';
import { motion } from 'framer-motion';

const PiggyIllustration = ({ size = 'lg', isShaking = false, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const containerSizes = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48',
    lg: 'w-64 h-64',
    xl: 'w-80 h-80'
  };

  return (
    <motion.div
      className={`relative flex items-center justify-center cursor-pointer select-none ${containerSizes[size] || containerSizes.lg}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={isShaking ? {
        rotate: [0, -12, 12, -12, 12, -6, 6, 0],
        scale: [1, 1.15, 1.15, 1.1, 1],
      } : {
        y: [0, -8, 0],
      }}
      transition={isShaking ? {
        duration: 0.6,
        ease: 'easeInOut'
      } : {
        duration: 3.5,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Background Glow Halo */}
      <motion.div
        className="absolute inset-4 rounded-full bg-gradient-to-tr from-piggy-pink/30 via-piggy-purple/20 to-piggy-gold/30 blur-2xl -z-10"
        animate={{
          scale: isHovered ? 1.2 : 1,
          opacity: isHovered ? 0.9 : 0.6
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Floating Heart over Piggy */}
      <motion.div
        className="absolute -top-4 right-6 text-2xl z-20 pointer-events-none drop-shadow-md"
        animate={{
          y: isHovered || isShaking ? [-5, -20, -5] : [0, -6, 0],
          scale: isHovered || isShaking ? [1, 1.3, 1] : [1, 1.1, 1],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        ❤️
      </motion.div>

      {/* SVG Piggy Body */}
      <svg
        viewBox="0 0 200 180"
        className="w-full h-full drop-shadow-2xl overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="piggyBodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF85C0" />
            <stop offset="50%" stopColor="#FF5CA8" />
            <stop offset="100%" stopColor="#E03E8C" />
          </linearGradient>
          <linearGradient id="snoutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFA6D2" />
            <stop offset="100%" stopColor="#FF6BB2" />
          </linearGradient>
          <linearGradient id="earGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E03E8C" />
            <stop offset="100%" stopColor="#C92A75" />
          </linearGradient>
          <linearGradient id="coinSlotGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFD166" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Back Legs */}
        <rect x="55" y="135" width="22" height="30" rx="11" fill="#C92A75" />
        <rect x="135" y="135" width="22" height="30" rx="11" fill="#C92A75" />

        {/* Tail Curly */}
        <path
          d="M165 95 C 185 85, 190 115, 175 110 C 165 105, 175 90, 185 95"
          stroke="#FF5CA8"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />

        {/* Back Ear */}
        <path d="M115 35 L140 15 L145 45 Z" fill="url(#earGradient)" />

        {/* Main Body Oval */}
        <ellipse cx="105" cy="95" rx="68" ry="55" fill="url(#piggyBodyGradient)" />

        {/* Front Ear */}
        <path d="M85 40 L65 12 L95 28 Z" fill="url(#earGradient)" />
        <path d="M82 36 L68 18 L90 28 Z" fill="#FFA6D2" opacity="0.6" />

        {/* Front Legs */}
        <rect x="65" y="140" width="24" height="28" rx="12" fill="url(#piggyBodyGradient)" />
        <rect x="125" y="140" width="24" height="28" rx="12" fill="url(#piggyBodyGradient)" />

        {/* Coin Slot on Top */}
        <rect x="90" y="38" width="30" height="6" rx="3" fill="#801848" opacity="0.7" />
        <rect x="92" y="39" width="26" height="4" rx="2" fill="url(#coinSlotGradient)" filter="url(#glow)" />

        {/* Cute Snout */}
        <ellipse cx="48" cy="98" rx="18" ry="22" fill="url(#snoutGradient)" stroke="#E03E8C" strokeWidth="2" />
        {/* Nostrils */}
        <ellipse cx="43" cy="95" rx="3" ry="5" fill="#B02568" />
        <ellipse cx="53" cy="95" rx="3" ry="5" fill="#B02568" />

        {/* Eyes */}
        {isHovered || isShaking ? (
          /* Happy Closed Eyes (> <) or (^ ^) */
          <g stroke="#601038" strokeWidth="3.5" strokeLinecap="round" fill="none">
            <path d="M 68 82 Q 73 74 78 82" />
          </g>
        ) : (
          /* Cute Open Eyes with Sparkle */
          <g>
            <circle cx="73" cy="80" r="6" fill="#400820" />
            <circle cx="71" cy="78" r="2" fill="#FFFFFF" />
          </g>
        )}

        {/* Rosy Cheek */}
        <ellipse cx="66" cy="96" rx="8" ry="5" fill="#FF2E93" opacity="0.4" />

        {/* Body Highlight Reflections */}
        <path d="M 85 55 Q 120 48 145 65" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.3" fill="none" />
      </svg>
    </motion.div>
  );
};

export default PiggyIllustration;
