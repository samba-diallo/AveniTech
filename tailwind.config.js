/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#05070F',
        mint: '#00E699',
        emeraldCustom: '#10B981',
        goldSable: '#DFBA6B',
        alabaster: '#F8F9FA',
      },
    },
  },
  plugins: [],
}


