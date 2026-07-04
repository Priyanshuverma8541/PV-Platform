/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    relative: true,
    files: [
      './src/**/*.{js,ts,jsx,tsx}',
      '../../apps/*/index.html',
      '../../apps/*/src/**/*.{js,ts,jsx,tsx}',
      '../../backend/*/src/**/*.{js,ts,jsx,tsx}',
      '../../pv-core/src/**/*.{js,ts,jsx,tsx}',
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
    },
  },
  plugins: [],
};
