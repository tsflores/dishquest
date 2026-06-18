/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'pantry-slate': '#2F4858',
        'pantry-white': '#FAFAF7',
        'saffron-gold': '#F6AE2D',
        'charcoal-slate': '#1F2933',
        'muted-blue-gray': '#6B7280',
        'herb-green': '#6A994E',
        'paprika-red': '#D95D39',
      },
      borderRadius: {
        card: '16px',
        pill: '24px',
      },
      fontFamily: {
        sans: ['Manrope', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
