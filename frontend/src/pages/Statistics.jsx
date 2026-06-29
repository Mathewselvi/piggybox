import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Tooltip, XAxis, YAxis } from 'recharts';
import { FiTrendingUp, FiAward, FiHash, FiPieChart, FiBarChart } from 'react-icons/fi';

const API_URL = import.meta.env.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5001/api' : '/api');

const Statistics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chartTab, setChartTab] = useState('daily'); // daily, monthly, yearly

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/transactions/stats`);
      setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pb-32 pt-12 px-5 max-w-lg mx-auto flex flex-col items-center justify-center">
        <div className="animate-spin text-4xl mb-3">💫</div>
        <p className="text-xs text-gray-500">Calculating Anna Ben Byju's magical numbers...</p>
      </div>
    );
  }

  if (!stats || stats.numberOfDeposits === 0) {
    return (
      <div className="pb-32 pt-6 px-5 max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white mb-6">Anna's Stats 📊</h1>
        <motion.div
          className="glass-card rounded-4xl p-10 text-center shadow-piggy"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        >
          <div className="text-6xl mb-4">📈</div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">No Charts Ready Yet</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Add a few transactions or go to Settings and click "Seed Demo Data" to see beautiful charts instantly! ✨
          </p>
        </motion.div>
      </div>
    );
  }

  const getChartData = () => {
    if (chartTab === 'monthly') return stats.monthlyChart || [];
    if (chartTab === 'yearly') return stats.yearlyChart || [];
    return stats.dailyChart || [];
  };

  return (
    <div className="pb-32 pt-6 px-5 max-w-lg mx-auto">
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-extrabold text-piggy-dark dark:text-white">Anna's Stats 📊</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Deep dive into Anna Ben Byju's savings patterns</p>
      </motion.div>

      {/* Top Summary Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-900/30 text-piggy-pink flex items-center justify-center mx-auto mb-1 text-sm">
            <FiTrendingUp />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Average</div>
          <div className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">₹{stats.averageSavings.toLocaleString('en-IN')}</div>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
        >
          <div className="w-7 h-7 rounded-full bg-purple-100 dark:bg-purple-900/30 text-piggy-purple flex items-center justify-center mx-auto mb-1 text-sm">
            <FiAward />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Highest</div>
          <div className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">₹{stats.highestDeposit.toLocaleString('en-IN')}</div>
        </motion.div>

        <motion.div
          className="glass-card rounded-3xl p-3.5 text-center shadow-sm"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="w-7 h-7 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-500 flex items-center justify-center mx-auto mb-1 text-sm">
            <FiHash />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Deposits</div>
          <div className="text-sm font-extrabold text-gray-800 dark:text-white mt-0.5">{stats.numberOfDeposits}</div>
        </motion.div>
      </div>

      {/* Interactive Bar Chart Section */}
      <motion.div
        className="glass-card rounded-4xl p-5 mb-6 shadow-piggy border border-white/80 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-white flex items-center gap-1.5">
            <FiBarChart className="text-piggy-pink" />
            <span>Savings Timeline</span>
          </h3>

          {/* Tab switches */}
          <div className="flex bg-white/60 dark:bg-white/5 p-1 rounded-full text-[10px] font-bold border border-gray-200/50 dark:border-white/10">
            {['daily', 'monthly', 'yearly'].map(tab => (
              <button
                key={tab}
                onClick={() => setChartTab(tab)}
                className={`px-3 py-1 rounded-full capitalize transition-all ${
                  chartTab === tab ? 'bg-piggy-pink text-white shadow-sm' : 'text-gray-500 hover:text-piggy-pink'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="h-48 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getChartData()}>
              <XAxis dataKey="name" stroke="#8884d8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', color: '#121212' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Saved']}
              />
              <Bar dataKey="amount" fill="#FF5CA8" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Growth Line Chart Section */}
      <motion.div
        className="glass-card rounded-4xl p-5 mb-6 shadow-sm border border-white/60 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h3 className="text-sm font-extrabold text-gray-800 dark:text-white mb-3 flex items-center gap-1.5">
          <FiTrendingUp className="text-piggy-purple" />
          <span>Growth Trend Curve</span>
        </h3>
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getChartData()}>
              <XAxis dataKey="name" stroke="#8884d8" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ borderRadius: '16px', background: 'rgba(255,255,255,0.9)', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontWeight: 'bold', color: '#121212' }}
                formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Amount']}
              />
              <Line type="monotone" dataKey="amount" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: '#FF5CA8' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Denominations Pie Chart Section */}
      <motion.div
        className="glass-card rounded-4xl p-5 mb-6 shadow-sm border border-white/60 dark:border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-extrabold text-gray-800 dark:text-white mb-2 flex items-center gap-1.5">
          <FiPieChart className="text-amber-500" />
          <span>Total Notes Saved Breakdown</span>
        </h3>

        {stats.pieChart && stats.pieChart.length > 0 ? (
          <div className="flex items-center justify-between">
            <div className="h-44 w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.pieChart}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {stats.pieChart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', background: 'rgba(255,255,255,0.95)', border: 'none', fontSize: '11px', fontWeight: 'bold', color: '#121212' }}
                    formatter={(value, name) => [`${value} notes`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="w-1/2 space-y-1.5 pl-2">
              {stats.pieChart.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-gray-400 text-[11px]">{item.value} notes</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 py-6 text-center">No note data available</p>
        )}
      </motion.div>
    </div>
  );
};

export default Statistics;
