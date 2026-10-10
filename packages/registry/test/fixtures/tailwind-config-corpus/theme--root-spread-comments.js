const base = require("./tailwind.base")

module.exports = {
  // Shared settings.
  ...base,
  content: [...base.content, "./src/**/*.{ts,tsx}"],
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      colors: { ...base.theme.extend.colors, brand: "red" },
    },
  },
}
