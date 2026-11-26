import type { Config } from "tailwindcss"

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontSize: {
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: [
          "1rem",
          {
            lineHeight: "1.5rem",
            letterSpacing: "-0.01em",
          },
        ],
      },
      dropShadow: {
        glow: ["0 0 2px rgb(255 255 255 / 0.5)", "0 0 8px rgb(255 255 255 / 0.3)"],
      },
    },
  },
  plugins: [],
} satisfies Config
