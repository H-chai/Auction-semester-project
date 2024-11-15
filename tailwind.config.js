/** @type {import('tailwindcss').Config} */
export default {
  content: ['./**/*.{html,js}', '!./node_modules/**/*'],
  theme: {
    fontFamily: {
      display: ['General Sans', 'sans-serif'],
      body: ['Gambetta', 'serif'],
    },
    colors: {
      black: '#212121',
      blue: '#034C8C',
      orange: '#FFA726',
      gray: '#727272',
      'light-gray': '#9E9E9E',
      green: '#8BC34A',
      red: '#D32F2F',
      'off-white': '#F5F5F5',
      outline: '#B0BEC5',
      'outline-light': '#E0E0E0',
    },
    extend: {},
  },
  plugins: [],
};
