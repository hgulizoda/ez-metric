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
        dark: {
          bg: '#0f1117',
          sidebar: '#1a1d2e',
          card: '#252836',
          border: 'rgba(255,255,255,0.08)',
          text: '#e2e8f0',
          muted: '#94a3b8',
        },
        light: {
          bg: '#f0f2f5',
          card: '#ffffff',
          border: 'rgba(0,0,0,0.08)',
        },
        primary: {
          DEFAULT: '#6366f1',
          hover: '#5254cc',
        },
        violet: '#8b5cf6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)',
      },
      boxShadow: {
        'card': '0 4px 24px rgba(0,0,0,0.15)',
        'card-hover': '0 8px 32px rgba(99,102,241,0.25)',
        'glow': '0 0 20px rgba(99,102,241,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'count-up': 'countUp 1s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
