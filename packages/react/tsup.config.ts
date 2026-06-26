import { readFileSync, writeFileSync } from "fs"
import { defineConfig } from "tsup"

const CLIENT_UI_ENTRIES = ["dist/message-scroller/index.js"]

export default defineConfig((options) => ({
  clean: !options.watch,
  dts: true,
  entry: {
    "message-scroller/index": "src/message-scroller/index.ts",
  },
  format: ["esm"],
  sourcemap: false,
  minify: true,
  target: "esnext",
  outDir: "dist",
  treeshake: true,
  plugins: [useClientDirectivePlugin(CLIENT_UI_ENTRIES)],
}))

// Prepends `"use client"` to listed dist entry files after the build. Bundlers
// strip the directive from source, but RSC apps need it on the published module
// so imports like `@shadcn/react/message-scroller` resolve as client boundaries.
function useClientDirectivePlugin(entries: string[]) {
  return {
    name: "use-client-directive",
    buildEnd({ writtenFiles }: { writtenFiles: { name: string }[] }) {
      const uiFiles = writtenFiles.filter((file) =>
        entries.some((entry) => file.name.replace(/\\/g, "/").endsWith(entry))
      )

      for (const file of uiFiles) {
        const code = readFileSync(file.name, "utf8")

        if (/^["']use client["'];?/.test(code)) {
          continue
        }

        writeFileSync(file.name, `"use client";\n${code}`)
      }
    },
  }
}
