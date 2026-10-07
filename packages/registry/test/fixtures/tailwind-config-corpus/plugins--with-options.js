const plugin = require("tailwindcss/plugin")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [
    require("@tailwindcss/typography")({
      className: "prose",
    }),
    plugin(function ({ addUtilities }) {
      addUtilities({ ".no-scrollbar": { "scrollbar-width": "none" } })
    }),
  ],
}
