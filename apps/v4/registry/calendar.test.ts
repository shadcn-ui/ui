import { readdirSync, readFileSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const registryDir = dirname(fileURLToPath(import.meta.url))
const appDir = resolve(registryDir, "..")

function findFiles(
  dir: string,
  match: (fileName: string) => boolean
): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)

    if (entry.isDirectory()) {
      return findFiles(path, match)
    }

    return match(entry.name) ? [path] : []
  })
}

const isCalendar = (fileName: string) => fileName === "calendar.tsx"
const isTsx = (fileName: string) => fileName.endsWith(".tsx")

// The class keys and component overrides asserted below only exist on the
// calendars built with react-day-picker. The react-aria calendars
// (registry/bases/aria and every styles/aria-* generated from it) render
// their own markup, so selecting by filename alone would sweep them in and
// fail on keys they are never meant to have.
const usesDayPicker = (file: string) =>
  readFileSync(file, "utf-8").includes("react-day-picker")

describe("calendar registry items", () => {
  const sourceFiles = [
    ...findFiles(resolve(appDir, "registry/bases"), isCalendar),
    ...findFiles(resolve(appDir, "registry/new-york-v4"), isCalendar),
    ...findFiles(resolve(appDir, "styles"), isCalendar),
  ].filter(usesDayPicker)
  // Only the frozen legacy styles are checked here: they have no .tsx source
  // and are maintained by editing the published JSON directly in git. All
  // other styles are generated from the sources checked above.
  const publicFiles = [
    ...findFiles(resolve(appDir, "public/r/styles/default"), (n) =>
      n.endsWith("calendar.json")
    ),
    ...findFiles(resolve(appDir, "public/r/styles/new-york"), (n) =>
      n.endsWith("calendar.json")
    ),
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

  // A week number is a row header inside the grid body, and react-day-picker
  // passes scope="row" down to it. scope is only valid on <th>, and the week
  // prop is not a DOM attribute, so an override that renders <td {...props}>
  // both drops the native semantics and leaks week="[object Object]".
  // Swept over every .tsx that overrides WeekNumber -- not just calendar.tsx
  // -- so example sources carrying their own copy are covered too.
  const weekNumberSources = [
    ...findFiles(resolve(appDir, "registry"), isTsx),
    ...findFiles(resolve(appDir, "styles"), isTsx),
  ].filter((file) => readFileSync(file, "utf-8").includes("WeekNumber: ({"))

  it("finds every WeekNumber override", () => {
    expect(weekNumberSources.length).toBeGreaterThan(0)
  })

  it.each(weekNumberSources.map((file) => [relative(appDir, file), file]))(
    "%s renders the week number as a <th> row header",
    (_, file) => {
      const source = readFileSync(file, "utf-8")

      expect(source).not.toContain("<td {...props}>")
      expect(source).toContain(
        "WeekNumber: ({ children, week: _week, ...props }) => {"
      )
      expect(source).toContain("<th {...props}>")
    }
  )
})
