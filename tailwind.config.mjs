/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', 'Arial', 'sans-serif'],
        'heading': ['Inter', '-apple-system', 'system-ui', 'BlinkMacSystemFont'],
        'accent': ['Poppins', 'Helvetica', 'sans-serif']
      },
      colors: {
        primary: '#1E88E5',
        secondary: '#7C4DFF',
        accent: '#00BFA5',
        dark: '#37474F',
        light: '#F5F7FA',
        'primary-dark': '#1976D2',
        'accent-dark': '#00ACC1',
        'secondary-dark': '#651FFF'
      }
    },
  },
  plugins: [],
};
