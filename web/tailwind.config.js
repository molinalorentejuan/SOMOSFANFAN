
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        brand: { DEFAULT: "#1e40ff" }, /* azul del panel */
        text: { DEFAULT: "#0F172A", mute: "#64748B" },
        card: { bg: "#FFFFFF", border: "#E5E7EB" },
      },
      boxShadow: { card: "0 8px 24px rgba(0,0,0,0.06)" },
      borderRadius: { xl: "1rem", '2xl': "1.25rem" },
      container: { center: true, padding: "1rem" },
    },
  },
  plugins: [],
};
