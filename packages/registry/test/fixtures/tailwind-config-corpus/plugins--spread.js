const base = require("./tailwind.base")

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [...base.plugins, require("@tailwindcss/forms")],
}
