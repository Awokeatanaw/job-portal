// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
  theme: {
    extend: {
      colors: {
        primary: '#414141',
        accent: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',  // ← Your orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9c2f0c',
          900: '#7c2d12',
        },
        hero: {
          start: '#0f172a',
          end: '#1e293b',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(to right, #0f172a, #1e293b)',
      },
    },
  },
  plugins: [],
};