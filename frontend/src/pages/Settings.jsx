import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';
import { FiMoon, FiSun, FiDownload, FiUpload, FiRefreshCw, FiDatabase, FiHeart, FiShield, FiAlertTriangle } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const Settings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [loadingSeed, setLoadingSeed] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark') || localStorage.getItem('piggyTheme') === 'dark';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('piggyTheme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('piggyTheme', 'light');
    }
    toast.success(`${nextDark ? 'Dark 🌙' : 'Light ☀️'} Mode Activated!`);
  };

  const handleSeedData = async () => {
    try {
      setLoadingSeed(true);
      await axios.post(`${API_URL}/transactions/seed`);
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      toast.success('Magical Demo Data Seeded! Enjoy PiggyLove ❤️', { icon: '✨' });
    } catch (error) {
      console.error('Error seeding data:', error);
      toast.error('Failed to seed data');
    } finally {
      setLoadingSeed(false);
    }
  };

  const handleExportData = async () => {
    try {
      const [transRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/goals`)
      ]);
      const exportData = {
        transactions: transRes.data,
        goals: goalsRes.data,
        exportDate: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `piggylove_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      toast.success('Data exported successfully! 📦');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to export data');
    }
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.transactions) {
          for (let t of data.transactions) {
            delete t._id;
            await axios.post(`${API_URL}/transactions`, t);
          }
        }
        if (data.goals) {
          for (let g of data.goals) {
            delete g._id;
            await axios.post(`${API_URL}/goals`, g);
          }
        }
        toast.success('Data restored successfully! ✨');
      } catch (err) {
        console.error('Import failed:', err);
        toast.error('Invalid backup file format ❤️');
      }
    };
    reader.readAsText(file);
  };

  const handleResetApp = async () => {
    if (!window.confirm('Are you sure you want to erase all Piggy savings and goals? This cannot be undone!')) {
      return;
    }
    try {
      const [transRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/goals`)
      ]);
      await Promise.all(transRes.data.map(t => axios.delete(`${API_URL}/transactions/${t._id}`)));
      await Promise.all(goalsRes.data.map(g => axios.delete(`${API_URL}/goals/${g._id}`)));
      toast.success('Piggy has been reset cleanly. Start fresh! 🌱');
    } catch (error) {
      console.error('Reset failed:', error);
      toast.error('Failed to reset app');
    }
  };

  return (
    <div className="pb-32 pt-6 px-5 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white">Anna's Settings ⚙️</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize Anna Ben Byju's magical Piggy experience</p>
      </motion.div>

      <div className="space-y-4">
        {/* Theme Card */}
        <motion.div
          className="glass-card rounded-3xl p-4 flex items-center justify-between shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${darkMode ? 'bg-purple-900/40 text-purple-400' : 'bg-amber-100 text-amber-500'}`}>
              {darkMode ? <FiMoon /> : <FiSun />}
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-800 dark:text-white">Appearance Theme</div>
              <div className="text-[11px] text-gray-400">{darkMode ? 'Dark Mode Active 🌙' : 'Light Mode Active ☀️'}</div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 flex items-center ${darkMode ? 'bg-piggy-purple justify-end' : 'bg-gray-300 justify-start'}`}
          >
            <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs">
              {darkMode ? '🌙' : '☀️'}
            </motion.div>
          </button>
        </motion.div>

        {/* Seed Demo Data Option */}
        <motion.div
          className="glass-card rounded-3xl p-4 flex items-center justify-between shadow-sm border-l-4 border-l-piggy-pink bg-gradient-to-r from-piggy-pink/5 to-transparent"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-piggy-pink/15 text-piggy-pink flex items-center justify-center text-lg">
              <FiDatabase />
            </div>
            <div>
              <div className="text-sm font-extrabold text-gray-800 dark:text-white">Seed Demo Data ✨</div>
              <div className="text-[11px] text-gray-400">Populate sample transactions & goals</div>
            </div>
          </div>

          <button
            onClick={handleSeedData}
            disabled={loadingSeed}
            className="px-4 py-2 rounded-full bg-piggy-pink text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
          >
            {loadingSeed ? 'Seeding...' : 'Seed Now'}
          </button>
        </motion.div>

        {/* Data Management (Export & Import) */}
        <motion.div
          className="glass-card rounded-3xl p-4 space-y-3 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Backup & Recovery</div>
          
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleExportData}
              className="py-3 px-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-extrabold text-gray-700 dark:text-gray-200 hover:border-piggy-pink transition-colors"
            >
              <FiDownload className="text-piggy-purple text-base" /> Export JSON
            </button>

            <label className="py-3 px-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center gap-2 text-xs font-extrabold text-gray-700 dark:text-gray-200 hover:border-piggy-pink transition-colors cursor-pointer">
              <FiUpload className="text-piggy-pink text-base" /> Import JSON
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          className="glass-card rounded-3xl p-4 flex items-center justify-between shadow-sm border border-red-500/20"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/40 text-red-500 flex items-center justify-center text-lg">
              <FiAlertTriangle />
            </div>
            <div>
              <div className="text-sm font-extrabold text-red-600 dark:text-red-400">Reset PiggyLove</div>
              <div className="text-[11px] text-gray-400">Erase all transactions & goals</div>
            </div>
          </div>

          <button
            onClick={handleResetApp}
            className="px-4 py-2 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-500 hover:text-white transition-colors"
          >
            Reset
          </button>
        </motion.div>

        {/* About PiggyLove Card */}
        <motion.div
          className="glass-card rounded-3xl p-6 text-center mt-8 relative overflow-hidden shadow-piggy border border-white/80 dark:border-white/10"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-piggy-pink to-piggy-purple text-white flex items-center justify-center text-2xl mx-auto mb-3 shadow-md">
            🐷
          </div>
          <h3 className="text-base font-extrabold text-gray-800 dark:text-white">About Anna Ben Byju's PiggyLove ❤️</h3>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1.5 leading-relaxed">
            Built as a surprise digital gift for Anna Ben Byju with Apple-level design, smooth micro-interactions, and pure love. No logins, no passwords—just Anna's dreams coming to life rupee by rupee.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-white/5 flex justify-center items-center gap-1 text-[11px] font-bold text-piggy-pink">
            <span>Made with</span>
            <FiHeart className="fill-piggy-pink text-piggy-pink animate-pulse" />
            <span>for Anna Ben Byju ❤️</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
