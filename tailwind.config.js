/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
  theme: {
    extend: {
      colors: {
        '[#FD4C2A]': '#FD4C2A',
      },
      fontFamily: {
        sans: ['Oxygen', 'sans-serif'],
      },
    },
  },
}