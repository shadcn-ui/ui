import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    testTimeout: 300000,
    hookTimeout: 300000,
    globals: true,
    environment: "node",
    globalSetup: ["./src/utils/setup.ts"],
    // These integration tests spawn real CLI processes and local servers.
    // Keep file-level parallelism bounded so CI doesn't time out under load.
    minWorkers: 1,
    maxWorkers: 2,
    maxConcurrency: 4,
    isolate: false,
  },
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
})
