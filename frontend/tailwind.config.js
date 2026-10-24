/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: "#0A2540",
          deep: "#081B2E",
          blue: "#1A56DB",
          lightBlue: "#EBF5FF",
          accent: "#F59E0B",
          emerald: "#059669",
          red: "#DC2626",
          slate: "#F8FAFC",
          card: "#FFFFFF",
          border: "#E2E8F0"
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 4px 20px -2px rgba(10, 37, 64, 0.08), 0 2px 6px -1px rgba(10, 37, 64, 0.04)',
        'gov-lg': '0 12px 32px -4px rgba(10, 37, 64, 0.12), 0 4px 12px -2px rgba(10, 37, 64, 0.06)',
      }
    },
  },
  plugins: [],
}
