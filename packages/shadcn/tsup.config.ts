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
  ],
  format: ["esm"],
  sourcemap: true,
  minify: true,
  target: "esnext",
  outDir: "dist",
  treeshake: true,
  onSuccess: async () => {
    copyFileSync("src/tailwind.css", "dist/tailwind.css")
  },
})
