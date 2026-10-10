module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      zIndex: { 60: 60, 70: "70" },
      opacity: { 15: 0.15 },
      lineHeight: { tight: 1.1, none: null },
      flex: { full: false },
      gridTemplateColumns: { 16: "repeat(16, minmax(0, 1fr))" },
    },
  },
}
