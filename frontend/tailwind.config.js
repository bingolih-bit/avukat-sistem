/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        urgent: '#ff3b30',
        warning: '#ff9500',
        safe: '#34c759',
        primary: '#007aff',
      },
    },
  },
  plugins: [],
}
