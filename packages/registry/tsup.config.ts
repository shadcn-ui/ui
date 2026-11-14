import { readdirSync, readFileSync } from "fs"
import path from "path"
import { compileFunction } from "vm"
import { defineConfig } from "tsup"

// On Windows, Node's ESM loader can fail to read a package.json whose path is
// longer than 260 characters (deep `pnpm dlx` caches) and then picks a .js
// file's format from its syntax alone. A file without import or export, such
// as an empty chunk, is then loaded as CommonJS, the CommonJS loader sees
// "type": "module", and the file ends up requiring itself
// (ERR_REQUIRE_CYCLE_MODULE, https://github.com/shadcn-ui/ui/issues/12147).
function assertModuleSyntax(outDir: string) {
  const commonJsFiles = readdirSync(outDir, {
    recursive: true,
    encoding: "utf8",
  })
    .filter((file) => file.endsWith(".js"))
    .filter((file) => {
      // Node detects ES modules the same way: code with import or export
      // does not compile as a CommonJS function body.
      try {
        compileFunction(readFileSync(path.join(outDir, file), "utf8"))
        return true
      } catch {
        return false
      }
    })

  if (commonJsFiles.length) {
    throw new Error(
      `These files have no import or export, so Node can load them as ` +
        `CommonJS: ${commonJsFiles.join(", ")}. An empty chunk usually comes from a ` +
        `module that only re-exports and is imported by several entries. ` +
        `Import from the module that defines the code instead.`
    )
  }
}

export default defineConfig((options) => ({
  clean: !options.watch,
  // Every module is emitted as its own declaration entry, which includes
  // files using dynamic import().
  dts: { compilerOptions: { module: "esnext" } },
  // Every module is an entry so shadcn can import any of them through
  // @shadcn/registry/internal/*. Shared code lands in chunks, so each module
  // (and its state) exists exactly once no matter which entry loads it.
  entry: [
    "src/**/*.ts",
    "!src/**/*.test.ts",
    "!src/**/*.integration.test.ts",
    "!src/test-helpers/**",
  ],
  format: ["esm"],
  sourcemap: false,
  minify: true,
  target: "esnext",
  outDir: "dist",
  treeshake: true,
  // Bundle @antfu/ni and its dependency tinyexec to avoid
  // module resolution failures with npx temporary installs.
  noExternal: ["@antfu/ni", "tinyexec"],
  onSuccess: async () => {
    assertModuleSyntax("dist")
  },
}))
