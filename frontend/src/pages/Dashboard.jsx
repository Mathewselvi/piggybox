import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import PiggyIllustration from '../components/PiggyIllustration';
import { FiPlus, FiTrendingUp, FiCalendar, FiTarget } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShaking, setIsShaking] = useState(false);

  // Greeting logic
  const [greeting, setGreeting] = useState({ title: 'Hello, Anna ❤️', message: 'Keep saving for your dreams, Anna Ben Byju!' });

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting({ title: 'Good Morning, Anna ☀️', message: 'Start your magical day with a smile ❤️' });
    } else if (hour < 17) {
      setGreeting({ title: 'Good Afternoon, Anna ⛅', message: 'Every rupee gets you closer to your dreams ❤️' });
    } else {
      setGreeting({ title: 'Good Evening, Anna 🌙', message: 'Keep saving, dream bigger Anna Ben Byju ❤️' });
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, goalsRes] = await Promise.all([
        axios.get(`${API_URL}/transactions/stats`),
        axios.get(`${API_URL}/goals`)
      ]);
      setStats(statsRes.data);
      setGoals(goalsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePiggyClick = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 600);
  };

  const activeGoal = goals.find(g => !g.completed) || goals[0] || null;
  const goalProgress = activeGoal ? Math.min(100, Math.round((activeGoal.savedAmount / activeGoal.targetAmount) * 100)) : 0;
  const remainingAmount = activeGoal ? Math.max(0, activeGoal.targetAmount - activeGoal.savedAmount) : 0;

  return (
    <div className="pb-28 pt-6 px-5 max-w-lg mx-auto">
      {/* Header Greeting */}
      <motion.div
        className="flex items-center justify-between mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-piggy-dark via-piggy-purple to-piggy-pink dark:from-white dark:via-piggy-light dark:to-piggy-pink bg-clip-text text-transparent">
            {greeting.title}
          </h1>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
            {greeting.message}
          </p>
        </div>
        <div className="w-10 h-10 rounded-full bg-piggy-pink/10 dark:bg-piggy-pink/20 flex items-center justify-center text-piggy-pink shadow-inner">
          ❤️
        </div>
      </motion.div>

      {/* Main Piggy Bank & Total Savings Showcase */}
      <motion.div
        className="glass-card rounded-4xl p-6 text-center relative overflow-hidden shadow-piggy mb-6 border border-white/80 dark:border-white/10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-piggy-gold/20 to-piggy-pink/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

        <div className="flex justify-center my-2" onClick={handlePiggyClick}>
          <PiggyIllustration size="lg" isShaking={isShaking} />
        </div>
        <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 dark:text-gray-400">
          Tap Piggy to Shake ✨
        </p>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-widest">
            Anna Ben Byju's Total Love Saved
          </span>
          <motion.div
            className="text-4xl font-extrabold text-piggy-dark dark:text-white mt-1 tracking-tight flex items-center justify-center gap-1"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <span className="text-piggy-pink text-3xl font-bold">₹</span>
            <span>{loading ? '...' : (stats?.totalSavings || 0).toLocaleString('en-IN')}</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Savings Goal Card */}
      {activeGoal ? (
        <motion.div
          className="glass-card rounded-3xl p-5 mb-6 relative overflow-hidden shadow-sm border border-white/60 dark:border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-500">
                <FiTarget className="text-lg" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white">{activeGoal.title}</h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Goal: ₹{activeGoal.targetAmount.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-piggy-pink/15 text-piggy-pink">
              {goalProgress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden p-0.5">
            <motion.div
              className="h-full bg-gradient-to-r from-piggy-pink via-piggy-purple to-amber-400 rounded-full shadow-sm"
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>

          <div className="flex justify-between items-center mt-2.5 text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span>Saved: <strong className="text-gray-800 dark:text-gray-200">₹{activeGoal.savedAmount.toLocaleString('en-IN')}</strong></span>
            <span>Remaining: <strong className="text-piggy-pink">₹{remainingAmount.toLocaleString('en-IN')}</strong></span>
          </div>
        </motion.div>
      ) : (
        <motion.div
          onClick={() => navigate('/goals')}
          className="glass-card rounded-3xl p-5 mb-6 text-center cursor-pointer border border-dashed border-piggy-pink/40 hover:bg-piggy-pink/5 transition-all"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-bold text-piggy-pink">+ Create Your First Dream Goal ✨</p>
        </motion.div>
      )}

      {/* Grid Stats (Today, Month, Streak) */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-7 h-7 rounded-full bg-green-100 dark:bg-green-900/30 text-green-500 flex items-center justify-center mb-1.5 text-sm">
            <FiTrendingUp />
          </div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Today</span>
          <span className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">
            ₹{loading ? '0' : (stats?.todaySavings || 0).toLocaleString('en-IN')}
          </span>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-piggy-purple flex items-center justify-center mb-1.5 text-sm">
            <FiCalendar />
          </div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Month</span>
          <span className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">
            ₹{loading ? '0' : (stats?.thisMonthSavings || 0).toLocaleString('en-IN')}
          </span>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm flex flex-col items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-500 flex items-center justify-center mb-1.5 text-sm animate-pulse">
            <span className="text-sm">🔥</span>
          </div>
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Streak</span>
          <span className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">
            {loading ? '0' : (stats?.streak || 0)} Days 🔥
          </span>
        </motion.div>
      </div>

      {/* Latest Entry Card */}
      {stats?.latestEntry && (
        <motion.div
          onClick={() => navigate('/history')}
          className="glass-card rounded-3xl p-4 cursor-pointer hover:shadow-md transition-shadow mb-6 flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-piggy-pink/15 flex items-center justify-center text-piggy-pink font-bold text-lg">
              ✨
            </div>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-white">{stats.latestEntry.note}</div>
              <div className="text-[10px] text-gray-400">{stats.latestEntry.date} • {stats.latestEntry.time}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-extrabold text-green-600 dark:text-green-400">+₹{stats.latestEntry.total.toLocaleString('en-IN')}</div>
            <div className="text-[9px] text-piggy-pink font-semibold">Latest Deposit →</div>
          </div>
        </motion.div>
      )}

      {/* Large Quick Add Money Floating Button */}
      <motion.button
        onClick={() => navigate('/add')}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="w-full py-4 rounded-3xl bg-gradient-to-r from-piggy-pink via-piggy-purple to-amber-500 text-white font-extrabold text-base shadow-piggy-lg flex items-center justify-center gap-2 tracking-wide"
      >
        <FiPlus className="text-xl stroke-[3]" />
        <span>Quick Add Money into Anna's Piggy 🐷</span>
      </motion.button>
    </div>
  );
};

export default Dashboard;
