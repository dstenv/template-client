/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue, js, ts, jsx, tsx}'],
  theme: {
    extend: {
      fontSize: {
        'xl': '14rem',
        '2xl': '16rem',
        '3xl': '18rem',
      },
      borderRadius: {
        'xl': '2rem',
        '2xl': '4rem',
        '3xl': '6rem',
        '4xl': '8rem',
        '5xl': '10rem',
        'range': '999rem',
      },
    },
  },
  plugins: [],
}
