const brand = "brand"

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        [brand]: "#ff0000",
        [`${brand}-foreground`]: "#ffffff",
        ["accent"]: "#00ff00",
      },
    },
  },
}
