/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        blob: "blob 7s infinite",
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)",
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)",
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)",
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)",
          },
        },
      },
      fontFamily: {
        display: ['Clash Display', '-apple-system', 'system-ui'],
        sans: ['Plus Jakarta Sans', 'Arial', 'sans-serif'],
        general: ['GeneralSans', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: '#1E88E5',
        secondary: '#7C4DFF',
        accent: '#00BFA5',
        dark: '#37474F',
        light: '#F5F7FA',
        'primary-dark': '#1976D2',
        'accent-dark': '#00ACC1',
        'secondary-dark': '#651FFF',
        'text-primary': '#FAF3E0',
        'text-secondary': '#4A5568',
        'text-muted': '#718096',
        'text-light': '#A0AEC0',
        'text-white': '#FFFFFF'
      },
    },
  },
  plugins: [],
};
