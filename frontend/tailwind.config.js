/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0f766e",
        secondary: "#14b8a6",
        background: "#e6f7f6",
      },
    },
  },
  plugins: [],
};