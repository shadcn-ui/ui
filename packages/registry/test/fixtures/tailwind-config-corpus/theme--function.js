module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: (theme) => ({
    extend: {
      colors: theme("colors"),
    },
  }),
  plugins: [],
}
