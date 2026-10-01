import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  clean: !options.watch,
  // Every module is emitted as its own declaration entry, which includes
  // files using dynamic import().
  dts: { compilerOptions: { module: "esnext" } },
  // Every module is an entry so shadcn can import any of them through
  // @shadcn/registry/internal/*. Shared code lands in chunks, so each module
  // (and its state) exists exactly once no matter which entry loads it.
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.integration.test.ts",
    "!src/test-helpers/**",
  ],
  format: ["esm"],
  sourcemap: false,
  minify: true,
  target: "esnext",
  outDir: "dist",
  treeshake: true,
  // Bundle @antfu/ni and its dependency tinyexec to avoid
  // module resolution failures with npx temporary installs.
  noExternal: ["@antfu/ni", "tinyexec"],
}))
