import { defineConfig } from "tsdown"

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
  copy: [{ from: "src/tailwind.css", to: "dist" }],
  outExtensions: () => ({ js: ".js", dts: ".d.ts" }),
})
