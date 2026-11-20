import { copyFileSync } from "fs"
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  // Wipe dist for production builds, but preserve it during `--watch` so the
  // `dist/tailwind.css` artifact the app imports never vanishes at cold start.
  clean: !options.watch,
  dts: true,
  entry: [
    "src/index.ts",
    "src/registry/index.ts",
    "src/schema/index.ts",
    "src/mcp/index.ts",
    "src/utils/index.ts",
    "src/icons/index.ts",
    "src/preset/index.ts",
    "src/tailwind.css",
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
  onSuccess: async () => {
    copyFileSync("src/tailwind.css", "dist/tailwind.css")
  },
}))
