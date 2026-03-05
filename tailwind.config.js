/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cat-productivity': '#3B82F6',
        'cat-interactions': '#06B6D4',
        'cat-flow': '#F59E0B',
        'cat-administration': '#EF4444',
        'cat-monitoring': '#8B5CF6',
        data3: {
          background: '#002061',
          surface: '#0a3080',
          'surface-light': '#1a4a9f',
          card: '#0f3a99',
          accent: '#6dcff6',
          button: '#32373c',
          text: '#ffffff',
          'text-muted': '#b0c4de',
          border: '#1a4090',
          'border-light': '#2a5ab8',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
