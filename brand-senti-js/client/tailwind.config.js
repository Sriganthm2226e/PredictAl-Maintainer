/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#020617",
          card: "#0f172a",
          border: "#1e293b",
        },
        brand: {
          primary: "#3b82f6",
          success: "#10b981",
          warning: "#f59e0b",
          danger: "#ef4444",
        }
      }
    },
  },
  plugins: [],
}
