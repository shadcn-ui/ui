import colors from "tailwindcss/colors"
import defaultTheme from "tailwindcss/defaultTheme"

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    ...defaultTheme,
    extend: {
      colors: {
        ...colors,
        brand: "#ff0000",
      },
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
        mono: [
          "var(--font-mono)",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem", ...defaultTheme.fontSize.xs }],
      },
    },
  },
  plugins: [],
}

export default config
