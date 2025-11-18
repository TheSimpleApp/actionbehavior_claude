/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a1a1a',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}
