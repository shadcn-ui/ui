const colors = require("tailwindcss/colors")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: colors.zinc,
        primary: colors.blue[500],
      },
    },
  },
  plugins: [],
}
