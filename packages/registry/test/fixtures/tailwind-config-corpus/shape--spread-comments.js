const shared = require("./tailwind.shared")

module.exports = {
  /* one */ /* two */
  ...shared,
  content: [
    "./src/**/*.{ts,tsx}", // app
    ...shared.content,
    "./components/**/*.{ts,tsx}",
  ],
  safelist: ["dark" /* dark */, ...shared.safelist, "light"],
  plugins: [
    require("@tailwindcss/forms"), // forms
    ...shared.plugins,
    require("@tailwindcss/typography"),
  ],
}
