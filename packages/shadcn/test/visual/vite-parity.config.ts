import path from "node:path"
import { fileURLToPath } from "node:url"

import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, "../../../..")
const appRoot = path.resolve(repoRoot, "apps/v4")
const harnessRoot = path.resolve(__dirname, "vite-harness")

export default defineConfig({
  root: harnessRoot,
  plugins: [
    tsconfigPaths({
      projects: [path.resolve(appRoot, "tsconfig.json")],
      ignoreConfigErrors: true,
    }),
  ],
  resolve: {
    alias: {
      "@": appRoot,
      "next/image": path.resolve(harnessRoot, "next-image.tsx"),
      "next/link": path.resolve(harnessRoot, "next-link.tsx"),
      react: path.resolve(appRoot, "node_modules/react"),
      "react-dom/client": path.resolve(appRoot, "node_modules/react-dom/client.js"),
      "react-dom/server": path.resolve(appRoot, "node_modules/react-dom/server.browser.js"),
      "react-dom": path.resolve(appRoot, "node_modules/react-dom"),
    },
  },
  css: {
    postcss: path.resolve(appRoot, "postcss.config.mjs"),
  },
  server: {
    host: "127.0.0.1",
    fs: {
      allow: [repoRoot],
    },
  },
})
