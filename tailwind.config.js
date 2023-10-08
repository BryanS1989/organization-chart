/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', 
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    minHeight: {
      '0.5': '0.125rem',
      '1': '0.25rem',
      '2': '0.5rem',
      '32': '8rem',
      '40': '10rem',
      '60': '15rem',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

