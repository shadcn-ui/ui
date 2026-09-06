import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  clean: !options.watch,
  dts: true,
  entry: {
    "ai-sdk/index": "src/ai-sdk/index.ts",
    "tanstack-ai/index": "src/tanstack-ai/index.ts",
  },
  format: ["esm"],
  sourcemap: false,
  minify: true,
  target: "esnext",
  outDir: "dist",
  treeshake: true,
}))
