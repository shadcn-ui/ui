import { copyFileSync, cpSync, existsSync, rmSync } from "fs"
import path from "path"
import { fileURLToPath } from "url"
import { defineConfig } from "tsup"

export default defineConfig((options) => ({
  // Wipe dist for production builds, but preserve it during `--watch` so the
  // `dist/tailwind.css` artifact the app imports never vanishes at cold start.
  clean: !options.watch,
  dts: true,
  entry: [
    "src/index.ts",
    "src/registry/index.ts",
    "src/schema/index.ts",
    "src/mcp/index.ts",
    "src/utils/index.ts",
    "src/icons/index.ts",
    "src/preset/index.ts",
    "src/tailwind.css",
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
    copyFileSync("src/tailwind.css", "dist/tailwind.css")

    const packageDir = path.dirname(fileURLToPath(import.meta.url))
    const rootSkillsDir = path.resolve(packageDir, "../../skills")
    const targetSkillsDir = path.resolve(packageDir, "skills")

    rmSync(targetSkillsDir, { recursive: true, force: true })

    for (const skill of ["shadcn", "migrate-radix-to-base"]) {
      const src = path.join(rootSkillsDir, skill)
      if (existsSync(src)) {
        cpSync(src, path.join(targetSkillsDir, skill), { recursive: true })
      }
    }
  },
}))
