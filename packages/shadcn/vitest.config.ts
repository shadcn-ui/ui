import path from "path"
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

const registry = path.resolve(__dirname, "../registry")

export default defineConfig({
  resolve: {
    // Run the CLI tests against the @shadcn/registry source so a test that
    // mocks a registry module mocks the same module the registry imports.
    alias: [
      {
        find: /^@shadcn\/registry$/,
        replacement: path.join(registry, "src/registry/index.ts"),
      },
      {
        find: /^@shadcn\/registry\/schema$/,
        replacement: path.join(registry, "src/schema/index.ts"),
      },
      {
        find: /^@shadcn\/registry\/internal\/(.*)$/,
        replacement: path.join(registry, "src/$1"),
      },
    ],
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
        path.join(registry, "tsconfig.json"),
      ],
    }),
  ],
})
