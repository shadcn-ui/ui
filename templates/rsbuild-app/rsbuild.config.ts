import path from "path"
import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"

// Docs: https://rsbuild.rs/config/
export default defineConfig({
  plugins: [pluginReact()],
  source: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
