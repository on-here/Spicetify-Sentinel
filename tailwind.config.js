/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        spotify: {
          base: '#121212',
          surface: '#181818',
          card: '#1e1e1e',
          elevated: '#282828',
          highlight: '#3e3e3e',
          green: '#1DB954',
          greenHover: '#1ed760',
          text: '#ffffff',
          subtext: '#b3b3b3',
          error: '#f15e6c',
          warning: '#f59e0b',
          border: '#282828',
        }
      },
      fontFamily: {
        sans: ['CircularStd', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
