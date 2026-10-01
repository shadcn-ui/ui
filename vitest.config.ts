import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

import { registrySourceAliases } from "./packages/registry/vitest.alias"

export default defineConfig({
  resolve: {
    alias: registrySourceAliases,
  },
  test: {
    exclude: [
      ...configDefaults.exclude,
      "**/node_modules/**",
      "**/fixtures/**",
      "**/templates/**",
      "**/packages/tests/**",
    ],
  },
  plugins: [
    tsconfigPaths({
      ignoreConfigErrors: true,
    }),
  ],
})
