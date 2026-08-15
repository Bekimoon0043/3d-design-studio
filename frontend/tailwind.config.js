/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0f1115',
          800: '#161a22',
          700: '#1e2430',
          600: '#2a3142',
        },
        accent: {
          DEFAULT: '#4f7cff',
          hover: '#6b92ff',
        },
      },
    },
  },
  plugins: [],
};
