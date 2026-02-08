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
          gold: '#3DD9C9',
          dark: '#202A25',
          accent: '#FF6700',
          red: '#A50104',
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
