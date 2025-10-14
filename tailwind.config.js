/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bitcoin: {
          orange: '#F7931A',
          gold: '#FFA500',
        },
        navy: {
          800: '#1e3a8a',
          900: '#1e293b',
        },
      },
    },
  },
  plugins: [],
}