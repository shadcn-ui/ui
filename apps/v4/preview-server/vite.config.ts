import { existsSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import tailwindcss from "@tailwindcss/vite"
import vue from "@vitejs/plugin-vue"
import { babel } from "@rollup/plugin-babel"
import Icons from "unplugin-icons/vite"
import { Preprocessor } from "content-tag"
import { defineConfig, type Plugin } from "vite"

const require = createRequire(import.meta.url)
const emberSourceDir = path.dirname(require.resolve("ember-source/package.json"))
const emberPackagesDir = path.join(emberSourceDir, "dist/packages")
const emberTemplateCompilerPath = path.join(emberSourceDir, "dist/ember-template-compiler.js")

/**
 * Vite plugin to resolve @ember/*, @glimmer/*, and @embroider/* imports
 * to the corresponding files within ember-source/dist/packages/.
 */
function emberModuleResolver(): Plugin {
  return {
    name: "ember-module-resolver",
    enforce: "pre",
    resolveId(source) {
      // Stub @embroider/macros (build-time only)
      if (source === "@embroider/macros") {
        return path.resolve(__dirname, "src/stubs/embroider-macros.ts")
      }
      // @glimmer/component is a standalone npm package,
      // but @glimmer/tracking needs ember-source's version (has @cached)
      const isEmberSourceGlimmer = source.startsWith("@glimmer/") &&
        !source.startsWith("@glimmer/component")
      if (
        source.startsWith("@ember/") ||
        isEmberSourceGlimmer
      ) {
        // Try index.js first, then source.js for nested paths
        const indexPath = path.join(emberPackagesDir, source, "index.js")
        if (existsSync(indexPath)) {
          return indexPath
        }
        // e.g., @ember/component/template-only → template-only.js
        return path.join(emberPackagesDir, source + ".js")
      }
      return null
    },
  }
}

/**
 * Minimal Vite plugin for .gts/.gjs files.
 * Uses content-tag to transform Ember's <template> syntax into JS.
 * This is the same approach as @embroider/vite's templateTag() plugin,
 * but without the full Ember app infrastructure.
 */
function emberTemplateTag(): Plugin {
  const preprocessor = new Preprocessor()
  return {
    name: "ember-template-tag",
    enforce: "pre",
    transform(code, id) {
      if (!/\.(gts|gjs)(\?.*)?$/.test(id)) {
        return null
      }
      return preprocessor.process(code, { filename: id })
    },
  }
}

const BABEL_EXTENSIONS = [".mjs", ".gjs", ".js", ".mts", ".gts", ".ts"]

export default defineConfig({
  base: "/preview/",
  plugins: [
    // Ember: resolve @ember/*, @glimmer/* imports to ember-source
    emberModuleResolver(),
    // Ember: transform <template> tags in .gts files
    emberTemplateTag(),
    // Ember: compile Handlebars templates + decorators via babel
    babel({
      babelHelpers: "runtime",
      extensions: BABEL_EXTENSIONS,
      plugins: [
        [require.resolve("decorator-transforms"), {}],
        ["@babel/plugin-transform-typescript", { allowDeclareFields: true }],
        [
          "babel-plugin-ember-template-compilation",
          {
            compilerPath: emberTemplateCompilerPath,
          },
        ],
        ["@babel/plugin-transform-runtime", { useESModules: true }],
      ],
      // Only apply to ember files to avoid interfering with Vue/Svelte
      include: ["**/ember/**", "**/ember-ui/**", "**/ember-lib/**"],
    }),
    // Ember: resolve ~icons/lucide/* imports
    Icons({ compiler: "raw" }),
    // Vue & Svelte
    vue(),
    svelte(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "$app/environment": path.resolve(
        __dirname,
        "src/stubs/app-environment.ts"
      ),
      "$app/stores": path.resolve(__dirname, "src/stubs/app-stores.ts"),
      "$app/navigation": path.resolve(
        __dirname,
        "src/stubs/app-navigation.ts"
      ),
      "$app/forms": path.resolve(__dirname, "src/stubs/app-forms.ts"),
      "$app/state": path.resolve(__dirname, "src/stubs/app-state.ts"),
    },
    extensions: [".mjs", ".gjs", ".js", ".mts", ".gts", ".ts", ".json"],
  },
  server: {
    port: 3001,
    cors: true,
  },
  appType: "spa",
})
