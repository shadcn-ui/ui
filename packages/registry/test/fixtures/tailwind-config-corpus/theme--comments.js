/** @type {import('tailwindcss').Config} */
module.exports = {
  // Paths to scan.
  content: ["./src/**/*.{ts,tsx}"], // all sources
  theme: {
    // Extend the default theme.
    extend: {
      colors: {
        brand: "#123456", // the brand color
        /* accent: "#654321", */
      },
    },
  },
  /* plugins */
  plugins: [],
}
