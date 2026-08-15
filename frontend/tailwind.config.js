/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#1b1d22',
        panelLight: '#24262d',
        border: '#33353c',
        accent: '#4f7cff',
        accentHover: '#6a90ff',
      },
    },
  },
  plugins: [],
};
