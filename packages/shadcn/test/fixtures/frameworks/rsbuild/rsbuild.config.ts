import { defineConfig } from "@rsbuild/core"
import { pluginReact } from "@rsbuild/plugin-react"
import { pluginTailwindcss } from "@rsbuild/plugin-tailwindcss"

export default defineConfig({
  plugins: [pluginReact(), pluginTailwindcss()],
})
