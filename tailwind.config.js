/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8f9fa",
          100: "#e9ecef",
          200: "#dee2e6",
          300: "#ced4da",
          400: "#adb5bd",
          500: "#6c757d",
          600: "#495057",
          700: "#343a40",
          800: "#212529",
          900: "#0a0908",
        },
        accent: {
          light: "#F0E5D8",
          DEFAULT: "#E2D1BC",
          dark: "#C2A987",
        },
        text: {
          dark: "#3A2820",
          light: "#8B6B4F",
        },
        cta: {
          primary: "#C26E38",
          hover: "#A85C2D",
        },
        heading: {
          primary: "#8A4117",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
}; 