import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import PiggyIllustration from '../components/PiggyIllustration';
import { FiPlus, FiMinus, FiCheckCircle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const DENOMINATIONS = [500, 200, 100, 50, 20, 10];
const NOTE_OPTIONS = ['Pocket Money', 'Gift', 'Savings', 'Festival', 'Salary', 'Other'];

const AddMoney = () => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0 });
  const [selectedNote, setSelectedNote] = useState('Savings');
  const [customNote, setCustomNote] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [droppingCoins, setDroppingCoins] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Calculate total automatically
  const totalAmount = DENOMINATIONS.reduce((sum, denom) => sum + denom * (counts[denom] || 0), 0);

  const handleIncrement = (denom) => {
    setCounts(prev => ({ ...prev, [denom]: prev[denom] + 1 }));
    // Trigger subtle piggy bounce
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 300);
  };

  const handleDecrement = (denom) => {
    setCounts(prev => ({ ...prev, [denom]: Math.max(0, prev[denom] - 1) }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF5CA8', '#8B5CF6', '#FFD166', '#22C55E', '#FFFFFF']
    });
  };

  const handleDropIntoPiggy = async () => {
    if (totalAmount <= 0) {
      toast.error('Please tap + to add at least some rupees ❤️');
      return;
    }

    setSubmitting(true);
    setIsShaking(true);
    triggerConfetti();

    // Spawn animated falling coins
    const newCoins = Array.from({ length: 6 }).map((_, i) => ({ id: Date.now() + i, left: 30 + Math.random() * 40 }));
    setDroppingCoins(newCoins);

    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const finalNote = selectedNote === 'Other' && customNote ? customNote : selectedNote;

    try {
      await axios.post(`${API_URL}/transactions`, {
        date: dateStr,
        time: timeStr,
        note: finalNote,
        total: totalAmount,
        notes: counts,
        500: counts[500],
        200: counts[200],
        100: counts[100],
        50: counts[50],
        20: counts[20],
        10: counts[10]
      });

      toast.success(`Yay Anna! ₹${totalAmount.toLocaleString('en-IN')} dropped into your Piggy! 🎉`, {
        icon: '🐷',
        style: {
          borderRadius: '24px',
          background: '#FFF8FC',
          color: '#121212',
          border: '2px solid #FF5CA8',
          fontWeight: 'bold'
        }
      });

      setTimeout(() => {
        navigate('/');
      }, 1800);
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error('Something went wrong, please try again.');
      setSubmitting(false);
      setIsShaking(false);
    }
  };

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeFormatted = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="pb-32 pt-6 px-5 max-w-lg mx-auto relative overflow-hidden">
      {/* Animated Falling Coins Overlay during drop */}
      <AnimatePresence>
        {droppingCoins.map(coin => (
          <motion.div
            key={coin.id}
            className="fixed z-50 text-3xl pointer-events-none drop-shadow-md"
            style={{ left: `${coin.left}%`, top: '-40px' }}
            initial={{ y: 0, opacity: 1, rotate: 0 }}
            animate={{ y: 600, opacity: 0, rotate: 360 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeIn' }}
          >
            🪙
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white">Add Money for Anna ❤️</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Tap + on Indian notes to feed Anna Ben Byju's Piggy</p>
      </motion.div>

      {/* Live Total Display with Mini Piggy */}
      <motion.div
        className="glass-card rounded-4xl p-5 mb-6 text-center relative overflow-hidden border border-piggy-pink/30 shadow-piggy"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
      >
        <div className="flex justify-center -my-4 pointer-events-none">
          <PiggyIllustration size="md" isShaking={isShaking} />
        </div>
        <div className="mt-2">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount to Drop</span>
          <motion.div
            key={totalAmount}
            initial={{ scale: 1.2, color: '#FF5CA8' }}
            animate={{ scale: 1, color: totalAmount > 0 ? '#FF5CA8' : 'inherit' }}
            className="text-4xl font-extrabold text-piggy-dark dark:text-white tracking-tight mt-0.5"
          >
            ₹{totalAmount.toLocaleString('en-IN')}
          </motion.div>
        </div>
      </motion.div>

      {/* Indian Denomination Note Counters */}
      <div className="space-y-3 mb-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2">Indian Notes Denomination</h3>
        {DENOMINATIONS.map((denom, index) => {
          const count = counts[denom];
          const subtotal = denom * count;

          const noteColors = {
            500: 'border-l-4 border-l-amber-500 bg-amber-50/40 dark:bg-amber-950/20',
            200: 'border-l-4 border-l-yellow-500 bg-yellow-50/40 dark:bg-yellow-950/20',
            100: 'border-l-4 border-l-purple-500 bg-purple-50/40 dark:bg-purple-950/20',
            50: 'border-l-4 border-l-cyan-500 bg-cyan-50/40 dark:bg-cyan-950/20',
            20: 'border-l-4 border-l-green-500 bg-green-50/40 dark:bg-green-950/20',
            10: 'border-l-4 border-l-rose-500 bg-rose-50/40 dark:bg-rose-950/20',
          };

          return (
            <motion.div
              key={denom}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`glass-card rounded-3xl p-3.5 flex items-center justify-between shadow-sm transition-all ${noteColors[denom] || ''}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-8 rounded-xl bg-white dark:bg-white/10 flex items-center justify-center font-extrabold text-sm text-gray-800 dark:text-white shadow-inner border border-gray-100 dark:border-white/5">
                  ₹{denom}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-700 dark:text-gray-200">Note</div>
                  {subtotal > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[10px] font-semibold text-piggy-pink"
                    >
                      = ₹{subtotal.toLocaleString('en-IN')}
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Counter Controls [-] 0 [+] */}
              <div className="flex items-center gap-3 bg-white/60 dark:bg-white/5 px-2 py-1 rounded-full border border-gray-200/60 dark:border-white/10">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleDecrement(denom)}
                  disabled={count === 0}
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    count > 0 ? 'bg-piggy-pink/15 text-piggy-pink hover:bg-piggy-pink hover:text-white' : 'text-gray-300 dark:text-gray-600'
                  }`}
                >
                  <FiMinus className="stroke-[3]" />
                </motion.button>

                <motion.span
                  key={count}
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  className="w-6 text-center font-extrabold text-sm text-gray-800 dark:text-white select-none"
                >
                  {count}
                </motion.span>

                <motion.button
                  whileTap={{ scale: 0.8 }}
                  onClick={() => handleIncrement(denom)}
                  className="w-8 h-8 rounded-full bg-piggy-pink text-white flex items-center justify-center shadow-sm hover:bg-piggy-pink/90 transition-colors"
                >
                  <FiPlus className="stroke-[3]" />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Optional Note Selector */}
      <div className="mb-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-2 mb-2.5">Select Reason / Note</h3>
        <div className="flex flex-wrap gap-2">
          {NOTE_OPTIONS.map(note => (
            <motion.button
              key={note}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedNote(note)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                selectedNote === note
                  ? 'bg-piggy-pink text-white shadow-piggy'
                  : 'glass-card text-gray-600 dark:text-gray-300 hover:border-piggy-pink/50'
              }`}
            >
              {note}
            </motion.button>
          ))}
        </div>
        {selectedNote === 'Other' && (
          <motion.input
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            type="text"
            placeholder="Type custom note..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            className="mt-3 w-full px-4 py-2.5 rounded-2xl glass-card text-xs font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-piggy-pink/30"
          />
        )}
      </div>

      {/* Auto Timestamp info */}
      <div className="flex justify-between items-center px-3 py-2 rounded-2xl bg-white/40 dark:bg-white/5 mb-6 text-[11px] font-medium text-gray-500 dark:text-gray-400 border border-white/60 dark:border-white/5">
        <span>📅 Date: <strong className="text-gray-700 dark:text-gray-200">{dateFormatted}</strong></span>
        <span>⏰ Time: <strong className="text-gray-700 dark:text-gray-200">{timeFormatted}</strong></span>
      </div>

      {/* Big Action Button */}
      <motion.button
        whileHover={{ scale: submitting ? 1 : 1.03 }}
        whileTap={{ scale: submitting ? 1 : 0.96 }}
        onClick={handleDropIntoPiggy}
        disabled={submitting || totalAmount === 0}
        className={`w-full py-4 rounded-3xl font-extrabold text-base flex items-center justify-center gap-2 shadow-piggy-lg transition-all ${
          totalAmount > 0
            ? 'bg-gradient-to-r from-piggy-pink via-piggy-purple to-amber-500 text-white cursor-pointer'
            : 'bg-gray-200 dark:bg-white/10 text-gray-400 dark:text-gray-500 cursor-not-allowed'
        }`}
      >
        {submitting ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin text-xl">💫</span>
            <span>Dropping into Anna's Piggy...</span>
          </div>
        ) : (
          <>
            <span>Drop into Anna's Piggy 🐷</span>
            <span className="text-lg">✨</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default AddMoney;
