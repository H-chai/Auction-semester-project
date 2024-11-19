/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,js}', '!./node_modules/**/*'],
  theme: {
    fontFamily: {
      display: ['Gambetta', 'serif'],
      body: ['General Sans', 'sans-serif'],
    },
    colors: {
      black: '#212121',
      white: '#FFFFFF',
      blue: '#034C8C',
      'light-blue': '#B3D1F2',
      orange: '#FFA726',
      gray: '#727272',
      'light-gray': '#9E9E9E',
      green: '#8BC34A',
      red: '#D32F2F',
      'off-white': '#F5F5F5',
      outline: '#B0BEC5',
      'outline-light': '#E0E0E0',
    },

    extend: {
      fontSize: {
        '3xl': ['1.75rem', '2.275rem'],
      },
      borderRadius: {
        md: '0.25rem',
      },
    },
  },
  plugins: [],
};
