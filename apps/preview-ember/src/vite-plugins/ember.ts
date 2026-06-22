import { existsSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { babel } from "@rollup/plugin-babel"
import Icons from "unplugin-icons/vite"
import { FileSystemIconLoader } from "unplugin-icons/loaders"
import { Preprocessor } from "content-tag"
import type { Plugin } from "vite"

const require = createRequire(import.meta.url)

// [FORCE-UI] Serve @material-symbols/svg-400 (rounded) as Ember icon components
// via `~icons/ms/<basename>`. svg-400 files have no fill, so force currentColor.
const msRoundedDir = path.join(
  path.dirname(require.resolve("@material-symbols/svg-400/package.json")),
  "rounded"
)
const emberSourceDir = path.dirname(
  require.resolve("ember-source/package.json")
)
const emberPackagesDir = path.join(emberSourceDir, "dist/packages")
const emberTemplateCompilerPath = path.join(
  emberSourceDir,
  "dist/ember-template-compiler.js"
)

function emberModuleResolver(stubsDir: string): Plugin {
  return {
    name: "ember-module-resolver",
    enforce: "pre",
    resolveId(source) {
      if (source === "@embroider/macros") {
        return path.resolve(stubsDir, "embroider-macros.ts")
      }
      const isEmberSourceGlimmer =
        source.startsWith("@glimmer/") &&
        !source.startsWith("@glimmer/component")
      if (source.startsWith("@ember/") || isEmberSourceGlimmer) {
        const indexPath = path.join(emberPackagesDir, source, "index.js")
        if (existsSync(indexPath)) {
          return indexPath
        }
        return path.join(emberPackagesDir, source + ".js")
      }
      return null
    },
  }
}

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

export function emberPlugins(stubsDir: string): Plugin[] {
  return [
    emberModuleResolver(stubsDir),
    emberTemplateTag(),
    babel({
      babelHelpers: "runtime",
      extensions: BABEL_EXTENSIONS,
      plugins: [
        [require.resolve("decorator-transforms"), {}],
        ["@babel/plugin-transform-typescript", { allowDeclareFields: true }],
        [
          "babel-plugin-ember-template-compilation",
          { compilerPath: emberTemplateCompilerPath },
        ],
        ["@babel/plugin-transform-runtime", { useESModules: true }],
      ],
      include: ["**/ember/**", "**/ember-ui/**", "**/ember-lib/**"],
    }) as Plugin,
    Icons({
      compiler: "ember",
      customCollections: {
        ms: FileSystemIconLoader(msRoundedDir, (svg) =>
          svg.replace(/<svg /, '<svg fill="currentColor" ')
        ),
      },
    }) as Plugin,
  ]
}
