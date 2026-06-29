/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        piggy: {
          pink: '#FF5CA8',
          light: '#FFE4F1',
          purple: '#8B5CF6',
          gold: '#FFD166',
          green: '#22C55E',
          bg: '#FFF8FC',
          dark: '#121212',
          card: 'rgba(255, 255, 255, 0.65)',
          darkcard: 'rgba(25, 25, 35, 0.75)'
        }
      },
      borderRadius: {
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        'piggy': '0 20px 40px -15px rgba(255, 92, 168, 0.15)',
        'piggy-lg': '0 25px 50px -12px rgba(255, 92, 168, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'gold-glow': '0 10px 25px -5px rgba(255, 209, 102, 0.4)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(-3%)', animationTimingFunction: 'cubic-bezier(0.8,0,1,1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0,0,0.2,1)' },
        }
      }
    },
  },
  plugins: [],
}
