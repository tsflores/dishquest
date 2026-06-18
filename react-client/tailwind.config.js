/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2F4858',
        background: '#FAFAF7',
        accent: '#F6AE2D',
        ink: '#1F2933',
        muted: '#6B7280',
        success: '#6A994E',
        alert: '#D95D39',
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
