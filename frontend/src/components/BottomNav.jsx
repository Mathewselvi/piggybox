import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiClock, FiPlus, FiBarChart2, FiTarget, FiSettings } from 'react-icons/fi';

const BottomNav = () => {
  const navItems = [
    { name: 'Home', path: '/', icon: FiHome },
    { name: 'History', path: '/history', icon: FiClock },
    { name: 'Add', path: '/add', icon: FiPlus, isAction: true },
    { name: 'Stats', path: '/statistics', icon: FiBarChart2 },
    { name: 'Goals', path: '/goals', icon: FiTarget },
    { name: 'Settings', path: '/settings', icon: FiSettings },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <motion.nav
        className="glass-nav pointer-events-auto flex items-center justify-between px-3 py-2 rounded-full shadow-piggy-lg max-w-md w-full border border-white/60 dark:border-white/10 backdrop-blur-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative group -top-5 mx-1"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-tr from-piggy-pink via-piggy-purple to-amber-400 flex items-center justify-center text-white shadow-piggy-lg border-4 border-piggy-bg dark:border-piggy-dark transition-all duration-300"
                >
                  <Icon className="text-2xl stroke-[3]" />
                </motion.div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-2 px-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'text-piggy-pink dark:text-piggy-pink font-semibold'
                    : 'text-gray-500 dark:text-gray-400 hover:text-piggy-pink dark:hover:text-piggy-pink'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    whileTap={{ scale: 0.8 }}
                    className="relative z-10 text-xl"
                  >
                    <Icon className={isActive ? 'stroke-[2.5]' : 'stroke-[1.75]'} />
                  </motion.div>
                  <span className="text-[10px] tracking-tight mt-0.5 relative z-10">
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-piggy-pink/10 dark:bg-piggy-pink/20 rounded-full -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </motion.nav>
    </div>
  );
};

export default BottomNav;
