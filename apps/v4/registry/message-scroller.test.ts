import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const registryDir = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(registryDir, "..")

function findFiles(dir: string, fileName: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      return findFiles(path, fileName)
    }

    return entry.name === fileName ? [path] : []
  })
}

describe("message-scroller registry items", () => {
  const sourceFiles = [
    ...findFiles(resolve(appDir, "registry/bases"), "message-scroller.tsx"),
    ...findFiles(
      resolve(appDir, "registry/new-york-v4"),
      "message-scroller.tsx"
    ),
  ]

  // data-autoscrolling toggles on every programmatic scroll. Changing
  // scrollbar-width with it makes classic scrollbars flash and reflows the
  // content while a reply streams, so only the scrollbar colors may change.
  it.each(sourceFiles.map((file) => [relative(appDir, file), file]))(
    "%s keeps the scrollbar width stable while autoscrolling",
    (_, file) => {
      const source = readFileSync(file, "utf-8")

      expect(source).not.toContain("data-autoscrolling:scrollbar-none")
      expect(source).toContain(
        "data-autoscrolling:scrollbar-thumb-transparent data-autoscrolling:scrollbar-track-transparent"
      )
    }
  )
})
