import { copyFileSync } from "fs"
import { defineConfig } from "tsup"

export default defineConfig({
  clean: true,
  dts: true,
  entry: [
    "src/index.ts",
    "src/registry/index.ts",
    "src/schema/index.ts",
    "src/mcp/index.ts",
    "src/utils/index.ts",
    "src/icons/index.ts",
    "src/preset/index.ts",
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
})
