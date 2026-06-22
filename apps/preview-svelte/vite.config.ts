import path from "node:path"
import { createRequire } from "node:module"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import Icons from "unplugin-icons/vite"
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import { defineConfig } from "vite"

// [FORCE-UI] Serve @material-symbols/svg-400 (rounded) as Svelte components via
// `~icons/ms/<basename>`. svg-400 files have no fill, so force currentColor.
const require = createRequire(import.meta.url)
const msRoundedDir = path.join(
  path.dirname(require.resolve("@material-symbols/svg-400/package.json")),
  "rounded"
)

export default defineConfig({
  base: "/preview/svelte/",
  build: {
    assetsDir: "_assets",
  },
  plugins: [
    Icons({
      compiler: "svelte",
      customCollections: {
        ms: FileSystemIconLoader(msRoundedDir, (svg) =>
          svg.replace(/<svg /, '<svg fill="currentColor" ')
        ),
      },
    }),
    svelte(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "$app/environment": path.resolve(__dirname, "src/stubs/app-environment.ts"),
      "$app/stores": path.resolve(__dirname, "src/stubs/app-stores.ts"),
      "$app/navigation": path.resolve(__dirname, "src/stubs/app-navigation.ts"),
      "$app/forms": path.resolve(__dirname, "src/stubs/app-forms.ts"),
      "$app/state": path.resolve(__dirname, "src/stubs/app-state.ts"),
    },
  },
  optimizeDeps: {
    exclude: ["sveltekit-superforms"],
  },
  server: {
    port: 3002,
    cors: true,
  },
  appType: "spa",
})
