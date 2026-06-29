import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiTrash2, FiEdit3, FiCalendar, FiClock, FiCheck, FiX } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNote, setEditNote] = useState('');
  const [editTotal, setEditTotal] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/transactions`);
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id));
      toast.success('Transaction deleted ❤️');
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error('Failed to delete');
    }
  };

  const startEdit = (t) => {
    setEditingId(t._id);
    setEditNote(t.note || '');
    setEditTotal(t.total || 0);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/transactions/${id}`, {
        note: editNote,
        total: Number(editTotal)
      });
      setTransactions(prev => prev.map(t => t._id === id ? res.data : t));
      setEditingId(null);
      toast.success('Updated successfully ✨');
    } catch (error) {
      console.error('Error updating:', error);
      toast.error('Failed to update');
    }
  };

  // Group transactions
  const groupTransactions = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yestDate = new Date();
    yestDate.setDate(yestDate.getDate() - 1);
    const yestStr = yestDate.toISOString().split('T')[0];

    const weekAgoDate = new Date();
    weekAgoDate.setDate(weekAgoDate.getDate() - 7);
    const weekAgoStr = weekAgoDate.toISOString().split('T')[0];

    const groups = {
      'Today ✨': [],
      'Yesterday 🌙': [],
      'This Week 📅': [],
      'Older Memories ⏳': []
    };

    transactions.forEach(t => {
      if (t.date === todayStr) {
        groups['Today ✨'].push(t);
      } else if (t.date === yestStr) {
        groups['Yesterday 🌙'].push(t);
      } else if (t.date >= weekAgoStr) {
        groups['This Week 📅'].push(t);
      } else {
        groups['Older Memories ⏳'].push(t);
      }
    });

    return groups;
  };

  const grouped = groupTransactions();

  return (
    <div className="pb-32 pt-6 px-5 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white">Anna Ben Byju's History ❤️</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Review Anna's magical savings timeline</p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce text-4xl">🐷</div>
        </div>
      ) : transactions.length === 0 ? (
        /* Empty State */
        <motion.div
          className="glass-card rounded-4xl p-10 text-center my-8 shadow-piggy"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-6xl mb-4">🍃</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No Savings Yet for Anna!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Anna Ben Byju's Piggy is ready for love. Tap the + button below to drop the first rupee! ❤️
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([title, items]) => {
            if (items.length === 0) return null;

            return (
              <div key={title} className="space-y-3">
                <h3 className="text-xs font-extrabold text-piggy-pink uppercase tracking-widest px-2 sticky top-2 z-10 backdrop-blur-md py-1 rounded-lg w-fit">
                  {title}
                </h3>

                <AnimatePresence>
                  {items.map((t) => {
                    const isEditing = editingId === t._id;
                    const notes = t.notes || {
                      500: t['500'] || 0,
                      200: t['200'] || 0,
                      100: t['100'] || 0,
                      50: t['50'] || 0,
                      20: t['20'] || 0,
                      10: t['10'] || 0
                    };

                    return (
                      <motion.div
                        key={t._id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                        className="glass-card rounded-3xl p-4 shadow-sm border border-white/60 dark:border-white/10 relative overflow-hidden group hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-2.5">
                          <div>
                            {isEditing ? (
                              <input
                                type="text"
                                value={editNote}
                                onChange={(e) => setEditNote(e.target.value)}
                                className="px-2 py-1 rounded-lg text-xs font-bold border border-piggy-pink bg-white/80 dark:bg-black/50 dark:text-white focus:outline-none"
                              />
                            ) : (
                              <h4 className="text-sm font-extrabold text-gray-800 dark:text-white flex items-center gap-1.5">
                                <span>🏷️</span>
                                <span>{t.note}</span>
                              </h4>
                            )}
                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-1">
                              <span className="flex items-center gap-0.5"><FiCalendar /> {t.date}</span>
                              <span className="flex items-center gap-0.5"><FiClock /> {t.time}</span>
                            </div>
                          </div>

                          <div className="text-right">
                            {isEditing ? (
                              <input
                                type="number"
                                value={editTotal}
                                onChange={(e) => setEditTotal(e.target.value)}
                                className="w-24 px-2 py-1 rounded-lg text-sm font-bold border border-piggy-pink bg-white/80 dark:bg-black/50 dark:text-white text-right focus:outline-none"
                              />
                            ) : (
                              <div className="text-lg font-extrabold text-green-600 dark:text-green-400">
                                +₹{t.total.toLocaleString('en-IN')}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Denomination Breakdown Pill Box */}
                        <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-2.5 my-2 text-[10px] grid grid-cols-3 gap-1.5 border border-white/40 dark:border-white/5">
                          {[500, 200, 100, 50, 20, 10].map(d => (
                            <div key={d} className={`flex justify-between px-2 py-0.5 rounded-lg ${notes[d] > 0 ? 'bg-piggy-pink/10 font-bold text-piggy-pink dark:text-piggy-light' : 'text-gray-400'}`}>
                              <span>₹{d}</span>
                              <span>× {notes[d] || 0}</span>
                            </div>
                          ))}
                        </div>

                        {/* Card Actions (Edit / Delete) */}
                        <div className="flex justify-end items-center gap-2 pt-2 border-t border-gray-100 dark:border-white/5 mt-2">
                          {isEditing ? (
                            <>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => saveEdit(t._id)}
                                className="px-3 py-1 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center gap-1"
                              >
                                <FiCheck /> Save
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={cancelEdit}
                                className="px-3 py-1 rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-[10px] font-bold flex items-center gap-1"
                              >
                                <FiX /> Cancel
                              </motion.button>
                            </>
                          ) : (
                            <>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => startEdit(t)}
                                className="p-1.5 rounded-full text-gray-400 hover:text-piggy-purple transition-colors"
                                title="Edit"
                              >
                                <FiEdit3 className="text-sm" />
                              </motion.button>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(t._id)}
                                className="p-1.5 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                                title="Delete"
                              >
                                <FiTrash2 className="text-sm" />
                              </motion.button>
                            </>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
