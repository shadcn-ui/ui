import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 60000,
    hookTimeout: 120000,
    globals: true,
    environment: "node",
    setupFiles: ["./src/utils/setup.ts"],
    maxConcurrency: 4,
    isolate: true,
  },
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
})
