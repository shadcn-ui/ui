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

describe("calendar registry items", () => {
  const sourceFiles = [
    ...findFiles(resolve(appDir, "registry/bases"), "calendar.tsx"),
    ...findFiles(resolve(appDir, "registry/new-york-v4"), "calendar.tsx"),
    ...findFiles(resolve(appDir, "styles"), "calendar.tsx"),
  ]
  const publicFiles = [
    ...findFiles(resolve(appDir, "public/r/styles"), "calendar.json"),
  ]

  it.each(sourceFiles.map((file) => [relative(appDir, file), file]))(
    "%s uses the react-day-picker v10 month_grid class key",
    (_, file) => {
      const source = readFileSync(file, "utf-8")

      expect(source).not.toContain('table: "w-full border-collapse"')
      expect(source).toContain(
        'month_grid: cn("w-full border-collapse", defaultClassNames.month_grid)'
      )
    }
  )

  it.each(publicFiles.map((file) => [relative(appDir, file), file]))(
    "%s publishes the react-day-picker v10 month_grid class key",
    (_, file) => {
      const source = readFileSync(file, "utf-8")

      expect(source).not.toContain('table: \\"w-full border-collapse\\"')
      expect(source).toContain(
        'month_grid: cn(\\"w-full border-collapse\\", defaultClassNames.month_grid)'
      )
    }
  )
})
