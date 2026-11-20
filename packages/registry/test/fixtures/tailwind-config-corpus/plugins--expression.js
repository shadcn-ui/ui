const base = require("./tailwind.base")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: base.plugins.concat([require("@tailwindcss/forms")]),
}
