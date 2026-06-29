import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';
import { FiTarget, FiPlus, FiTrash2, FiCheckCircle, FiAward, FiEdit2, FiTrash } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal state
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  // Edit Modal state
  const [editingGoal, setEditingGoal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTargetAmount, setEditTargetAmount] = useState('');
  const [editSavedAmount, setEditSavedAmount] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/goals`);
      setGoals(res.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    if (!title || !targetAmount || Number(targetAmount) <= 0) {
      toast.error('Please enter a valid title and target amount ❤️');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/goals`, {
        title,
        targetAmount: Number(targetAmount)
      });
      setGoals([res.data, ...goals]);
      setTitle('');
      setTargetAmount('');
      setShowModal(false);
      toast.success('New Dream Goal created! ✨');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch (error) {
      console.error('Error creating goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditTargetAmount(goal.targetAmount);
    setEditSavedAmount(goal.savedAmount);
  };

  const handleUpdateGoal = async (e) => {
    e.preventDefault();
    if (!editTitle || !editTargetAmount || Number(editTargetAmount) <= 0) {
      toast.error('Please enter valid details ❤️');
      return;
    }

    try {
      const res = await axios.put(`${API_URL}/goals/${editingGoal._id}`, {
        title: editTitle,
        targetAmount: Number(editTargetAmount),
        savedAmount: Number(editSavedAmount || 0)
      });
      setGoals(prev => prev.map(g => g._id === editingGoal._id ? res.data : g));
      setEditingGoal(null);
      toast.success('Goal updated successfully! ✨');
      if (res.data.completed) {
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const handleDeleteGoal = async (id) => {
    try {
      await axios.delete(`${API_URL}/goals/${id}`);
      setGoals(prev => prev.filter(g => g._id !== id));
      toast.success('Goal removed ❤️');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete');
    }
  };

  const handleRemoveAllGoals = async () => {
    if (!window.confirm('Are you sure you want to remove all current goals? This action cannot be undone! ❤️')) {
      return;
    }
    try {
      await axios.delete(`${API_URL}/goals`);
      setGoals([]);
      toast.success('All goals removed cleanly! 🧹');
    } catch (error) {
      console.error('Error removing all goals:', error);
      toast.error('Failed to remove goals');
    }
  };

  const triggerCelebration = (pct) => {
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF5CA8', '#FFD166', '#8B5CF6']
    });
    toast.success(`Woohoo! You reached ${pct}% milestone! 🎉`, { icon: '👑' });
  };

  return (
    <div className="pb-32 pt-6 px-5 max-w-lg mx-auto">
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white">Anna's Dream Goals 🎯</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage targets for Anna Ben Byju's wishes</p>
        </div>
        <div className="flex items-center gap-2">
          {goals.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRemoveAllGoals}
              title="Remove all goals"
              className="px-3 py-2 rounded-full bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50 text-xs font-bold flex items-center gap-1 shadow-sm transition-colors hover:bg-red-100"
            >
              <FiTrash /> Clear All
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-full bg-gradient-to-r from-piggy-pink to-piggy-purple text-white text-xs font-bold flex items-center gap-1.5 shadow-piggy"
          >
            <FiPlus className="stroke-[3]" /> Add Goal
          </motion.button>
        </div>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce text-4xl">🎯</div>
        </div>
      ) : goals.length === 0 ? (
        /* Empty State */
        <motion.div
          className="glass-card rounded-4xl p-10 text-center my-8 shadow-piggy"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="text-6xl mb-4">🌟</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No Current Goals</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
            All current goals have been cleared. Tap "Add Goal" above to create a fresh custom savings target for Anna Ben Byju! ❤️
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {goals.map((g, index) => {
              const pct = Math.min(100, Math.round((g.savedAmount / g.targetAmount) * 100));
              const milestones = [25, 50, 75, 100];

              return (
                <motion.div
                  key={g._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card rounded-4xl p-5 relative overflow-hidden shadow-sm border ${
                    g.completed ? 'border-amber-400/80 bg-amber-50/20 dark:bg-amber-950/20' : 'border-white/60 dark:border-white/10'
                  }`}
                >
                  {g.completed && (
                    <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-400 to-piggy-gold text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-2xl uppercase tracking-widest flex items-center gap-1 shadow-sm">
                      <FiAward /> Achieved! 🎉
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                        g.completed ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-piggy-pink/15'
                      }`}>
                        {g.completed ? '👑' : '🎯'}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-gray-800 dark:text-white">{g.title}</h3>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          ₹{g.savedAmount.toLocaleString('en-IN')} <span className="text-gray-400">/ ₹{g.targetAmount.toLocaleString('en-IN')}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(g)}
                        className="p-2 text-gray-400 hover:text-piggy-purple transition-colors"
                        title="Edit Goal"
                      >
                        <FiEdit2 />
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(g._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete Goal"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  {/* Animated Progress Bar */}
                  <div className="w-full h-4 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-0.5 relative my-3">
                    <motion.div
                      className={`h-full rounded-full shadow-sm ${
                        g.completed ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-piggy-gold' : 'bg-gradient-to-r from-piggy-pink via-piggy-purple to-amber-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                    />
                  </div>

                  {/* Milestone Celebrations Badges */}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs font-extrabold text-piggy-pink">{pct}% Completed</span>
                    
                    <div className="flex gap-1.5">
                      {milestones.map(m => (
                        <button
                          key={m}
                          onClick={() => pct >= m && triggerCelebration(m)}
                          disabled={pct < m}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-all ${
                            pct >= m
                              ? 'bg-gradient-to-r from-piggy-pink to-piggy-purple text-white shadow-sm cursor-pointer hover:scale-110'
                              : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 opacity-50 cursor-not-allowed'
                          }`}
                          title={pct >= m ? `Tap to celebrate ${m}%!` : `Reach ${m}% to unlock`}
                        >
                          {m}% {pct >= m ? '✨' : '🔒'}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Create Goal Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-nav rounded-4xl p-6 max-w-sm w-full shadow-piggy-lg border border-white/80 dark:border-white/10"
            >
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-4 text-center">Create Goal for Anna ✨</h3>
              
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dream Phone ❤️"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-gray-200 dark:border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-gray-200 dark:border-white/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="w-1/2 py-3 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-piggy-pink to-piggy-purple text-white text-xs font-bold shadow-piggy hover:opacity-90 transition-opacity"
                  >
                    Save Goal 🎯
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Goal Modal */}
      <AnimatePresence>
        {editingGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-nav rounded-4xl p-6 max-w-sm w-full shadow-piggy-lg border border-white/80 dark:border-white/10"
            >
              <h3 className="text-lg font-extrabold text-gray-800 dark:text-white mb-4 text-center">Update Goal Details ✏️</h3>
              
              <form onSubmit={handleUpdateGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Goal Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-gray-200 dark:border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editTargetAmount}
                    onChange={(e) => setEditTargetAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-gray-200 dark:border-white/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Saved Amount (₹)</label>
                  <input
                    type="number"
                    required
                    value={editSavedAmount}
                    onChange={(e) => setEditSavedAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-2xl glass-card text-sm font-medium text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-piggy-pink border border-gray-200 dark:border-white/10"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingGoal(null)}
                    className="w-1/2 py-3 rounded-2xl bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-3 rounded-2xl bg-gradient-to-r from-piggy-pink to-piggy-purple text-white text-xs font-bold shadow-piggy hover:opacity-90 transition-opacity"
                  >
                    Update Goal ✨
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
