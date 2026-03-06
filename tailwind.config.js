/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "Apple Color Emoji",
          "Segoe UI Emoji"
        ]
      },
      colors: {
        brand: {
          green: "#0b6a3a",
          greenDark: "#07512c",
          orange: "#f2a24f"
        }
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,.30)",
        glow: "0 0 0 1px rgba(255,255,255,.08), 0 16px 50px rgba(0,0,0,.45)"
      }
    }
  },
  plugins: []
};

