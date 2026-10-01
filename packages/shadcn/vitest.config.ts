import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

import { registrySourceAliases } from "../registry/vitest.alias"

export default defineConfig({
  resolve: {
    // Run the CLI tests against the @shadcn/registry source so a test that
    // mocks a registry module mocks the same module the registry imports.
    alias: registrySourceAliases,
  },
  test: {
    exclude: [
      ...configDefaults.exclude,
      "**/node_modules/**",
      "**/fixtures/**",
    ],
    testTimeout: 8000,
  },
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
      projects: [
        path.join(__dirname, "tsconfig.json"),
        path.join(__dirname, "../registry/tsconfig.json"),
      ],
    }),
  ],
})
