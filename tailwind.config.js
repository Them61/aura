/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./{pages,components}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          gold: '#C5A059',
          dark: '#0A0F1C',
          accent: '#CC5500',
          light: '#F9F5F0'
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
        sans: ['Montserrat', 'sans-serif']
      }
    }
  },
  plugins: [],
}
