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
    container: {
      screens: {
        xl: '100%',
      },
    },

    extend: {
      fontSize: {
        '3xl': ['1.75rem', '2.275rem'],
      },
      borderRadius: {
        md: '0.25rem',
      },
      animation: {
        'slider-01': 'slider-01 32s infinite',
        'slider-02': 'slider-02 32s infinite',
        'slider-03': 'slider-03 32s infinite',
      },
      keyframes: {
        'slider-01': {
          '0%': { opacity: 1 },
          '30%': { opacity: 1 },
          '40%': { opacity: 0 },
          '90%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        'slider-02': {
          '0%': { opacity: 0 },
          '30%': { opacity: 0 },
          '40%': { opacity: 1 },
          '60%': { opacity: 1 },
          '70%': { opacity: 0 },
          '100%': { opacity: 0 },
        },
        'slider-03': {
          '0%': { opacity: 0 },
          '60%': { opacity: 0 },
          '70%': { opacity: 1 },
          '90%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      aspectRatio: {
        '4/3': '4 / 3',
      },
    },
  },
  plugins: [],
};
