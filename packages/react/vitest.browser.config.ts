import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

// Browser tests to cover what jsdom cannot.
// for example native scroll anchoring on prepend.
export default defineConfig({
  test: {
    include: ["src/**/*.browser.test.{ts,tsx}"],
    setupFiles: ["./vitest.browser.setup.ts"],
    browser: {
      enabled: true,
      provider: "playwright",
      headless: true,
      instances: [{ browser: "chromium" }],
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom/client", "react/jsx-dev-runtime"],
  },
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
})
