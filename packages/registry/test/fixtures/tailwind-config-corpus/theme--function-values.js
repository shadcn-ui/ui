module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: { css: { color: theme("colors.gray.700") } },
      }),
      spacing: ({ theme }) => theme("width"),
      borderColor(theme) {
        return theme("colors.gray")
      },
    },
  },
}
