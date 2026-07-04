/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      './apps/*/index.html',
      './apps/*/src/**/*.{js,ts,jsx,tsx}',
      './backend/*/src/**/*.{js,ts,jsx,tsx}',
      './packages/*/src/**/*.{js,ts,jsx,tsx}',
      './pv-core/src/**/*.{js,ts,jsx,tsx}',
    ],
  },
  theme: {
    extend: {
      colors: {
        pv: {
          bg: '#030711',
          surface: '#0f172a',
          cyan: '#4ef3c4',
          blue: '#38bdf8',
          purple: '#a855f7',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        pv: '0 24px 70px rgba(0, 0, 0, 0.32)',
        glow: '0 18px 48px rgba(78, 243, 196, 0.22)',
      },
    },
  },
  plugins: [],
};
