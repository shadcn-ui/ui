const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        xs: ["0.75rem", { ...defaultTheme.fontSize.xs[1], lineHeight: "1rem" }],
      },
    },
  },
  plugins: [],
}
