/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        '52': 'repeat(52, minmax(0, 1fr))',
        '53': '20px repeat(52, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}