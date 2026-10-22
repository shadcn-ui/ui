import type { Config } from "tailwindcss"

export default {
  darkMode: ["selector", ".dark"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config
