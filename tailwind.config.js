/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a73e8',
          hover: '#1765c1',
          soft: '#e8f0fe',
        },
        bg: {
          main: '#f1f3f4',
          surface: '#ffffff',
          sidebar: '#f6f8fc',
        },
        text: {
          main: '#202124',
          secondary: '#5f6368',
          disabled: '#9aa0a6',
        },
        border: {
          subtle: '#dadce0',
        },
      },
    },
  },
  plugins: [],
};

