import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import svgLoader from "vite-svg-loader"
import { defineConfig } from "vite"

export default defineConfig({
  base: "/preview/vue/",
  build: {
    assetsDir: "_assets",
  },
  // [FORCE-UI] Render @material-symbols/svg-400 SVGs as Vue components (?component).
  // svg-400 files have no fill + fixed 48px size; force currentColor and drop the
  // hard dimensions so className/font-size controls sizing.
  plugins: [
    svgLoader({
      svgoConfig: {
        plugins: [
          {
            name: "preset-default",
            params: { overrides: { removeViewBox: false } },
          },
          { name: "removeDimensions" },
          {
            name: "addAttributesToSVGElement",
            params: { attributes: [{ fill: "currentColor" }] },
          },
        ],
      },
    }),
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001,
    cors: true,
  },
  appType: "spa",
})
