/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        council: {
          bg: '#09090b',
          surface: '#0f0f13',
          card: '#14141a',
          border: '#1e1e2a',
          accent: {
            blue: '#3b82f6',
            violet: '#8b5cf6',
            cyan: '#06b6d4',
            pink: '#ec4899',
          },
          text: {
            primary: '#f0f0f5',
            secondary: '#8888a0',
            muted: '#55556a',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 4s ease-in-out infinite',
        'materialize': 'materialize 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'beam': 'beam 1.5s ease-out forwards',
        'wave': 'wave 2s ease-in-out infinite',
        'line-draw': 'line-draw 1s ease-out forwards',
        'fade-up': 'fade-up 0.5s ease-out forwards',
        'spin-slow': 'spin 8s linear infinite',
        'particle': 'particle 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'breathe': {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        'materialize': {
          '0%': { opacity: '0', filter: 'blur(10px)', transform: 'translateY(10px) scale(0.95)' },
          '100%': { opacity: '1', filter: 'blur(0px)', transform: 'translateY(0) scale(1)' },
        },
        'beam': {
          '0%': { opacity: '0', transform: 'scaleY(0)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0.3', transform: 'scaleY(1)' },
        },
        'wave': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.5)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        'line-draw': {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'particle': {
          '0%, 100%': { transform: 'translate(0, 0)', opacity: '0.3' },
          '25%': { transform: 'translate(10px, -20px)', opacity: '0.8' },
          '50%': { transform: 'translate(-5px, -40px)', opacity: '0.4' },
          '75%': { transform: 'translate(15px, -20px)', opacity: '0.7' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
