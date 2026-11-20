/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        maroon: { DEFAULT: '#4A1719', dark: '#3A1113' },
        brick: '#8E3028',
        gold: { DEFAULT: '#DDA44C', light: '#E8BB72' },
        cream: { DEFAULT: '#F5EBD7', dark: '#EADBBE' },
        brown: '#29231E',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        deva: ['"Noto Serif Devanagari"', '"Playfair Display"', 'serif'],
        sans: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 6px 20px -8px rgba(41,35,30,.35)',
        lift: '0 18px 36px -14px rgba(41,35,30,.5)',
      },
    },
  },
  plugins: [],
};
