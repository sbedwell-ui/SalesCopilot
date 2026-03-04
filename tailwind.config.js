/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        productivity: '#3B82F6',
        interactions: '#06B6D4',
        'flow-of-work': '#F59E0B',
        administration: '#EF4444',
        monitoring: '#8B5CF6',
      },
    },
  },
  plugins: [],
};
