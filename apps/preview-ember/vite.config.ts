import path from "node:path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { emberPlugins } from "./src/vite-plugins/ember"

const stubsDir = path.resolve(__dirname, "src/stubs")

const embroiderMacrosStub = {
  name: "embroider-macros-stub",
  setup(build: { onResolve: Function; onLoad: Function }) {
    build.onResolve({ filter: /^@embroider\/macros$/ }, () => ({
      path: "embroider-macros-stub",
      namespace: "embroider-macros",
    }))
    build.onLoad({ filter: /.*/, namespace: "embroider-macros" }, () => ({
      contents: `
        export function macroCondition(v) { return v; }
        export function isDevelopingApp() { return false; }
        export function isTesting() { return false; }
        export function importSync() { return {}; }
        export function getOwnConfig() { return {}; }
        export function dependencySatisfies() { return true; }
        export function getGlobalConfig() { return {}; }
        export function appEmberSatisfies() { return true; }
      `,
      loader: "js",
    }))
  },
}

export default defineConfig({
  base: "/preview/ember/",
  build: {
    assetsDir: "_assets",
  },
  plugins: [...emberPlugins(stubsDir), tailwindcss()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [embroiderMacrosStub],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    extensions: [".mjs", ".gjs", ".js", ".mts", ".gts", ".ts", ".json"],
  },
  server: {
    port: 3003,
    cors: true,
  },
  appType: "spa",
})
