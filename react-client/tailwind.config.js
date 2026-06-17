/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2D6A4F',
        'warm-cream': '#FAF3E0',
        'coral-orange': '#E76F51',
      },
      borderRadius: {
        card: '16px',
        pill: '24px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
