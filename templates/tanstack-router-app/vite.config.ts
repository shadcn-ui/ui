import path from "node:path"
import { defineConfig } from "vite"
import { tanstackRouter } from "@tanstack/router-plugin/vite"
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import svgr from "vite-plugin-svgr"

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    // Material Symbols SVGs -> React components. icon:true sizes to 1em;
    // fill=currentColor so icons inherit text color like lucide did.
    svgr({
      svgrOptions: { icon: true, svgProps: { fill: "currentColor" } },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
