/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#e6f7f6",
          100: "#c2e8e6",
          200: "#9dd9d3",
          300: "#78c9c0",
          400: "#53baad",
          500: "#4C9AA5",  // main primary
          600: "#3d8b92",
          700: "#316b75",
          800: "#254c58",
          900: "#192d3b",
        },
        secondary: "#3C8791",
        background: "#F6FAFB",
        surface: "#FFFFFF",
        border: "#E5EEF0",
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          muted: "#94A3B8",
        },
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
      },
      boxShadow: {
        card: "0 10px 25px rgba(0,0,0,0.06)",
        soft: "0 4px 12px rgba(0,0,0,0.05)",
        "card-hover": "0 20px 40px rgba(76, 154, 165, 0.15)",
      },
      borderRadius: {
        xl: "16px",
        lg: "12px",
        md: "8px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

