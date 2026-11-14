import type { Config } from "tailwindcss"

export default {
  darkMode: [
    "variant",
    "&:is(.dark *)",
  ],
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [],
} satisfies Config
