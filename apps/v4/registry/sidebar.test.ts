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

describe("sidebar open-state styling (#11479)", () => {
  const styleFiles = readdirSync(resolve(appDir, "registry/styles"), {
    withFileTypes: true,
  })
    .filter(
      (entry) =>
        entry.isFile() &&
        entry.name.startsWith("style-") &&
        entry.name.endsWith(".css")
    )
    .map((entry) => resolve(appDir, "registry/styles", entry.name))

  it.each(styleFiles.map((file) => [relative(appDir, file), file]))(
    "%s styles .cn-sidebar-menu-button using aria-expanded for open state",
    (_, file) => {
      const source = readFileSync(file, "utf-8")

      expect(source).not.toContain("data-open:hover:bg-sidebar-accent")
      expect(source).not.toContain(
        "data-open:hover:text-sidebar-accent-foreground"
      )
      expect(source).toContain(
        "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
      )
    }
  )

  it("team-switcher in sidebar-07 uses aria-expanded open state classes", () => {
    const teamSwitcherFile = resolve(
      appDir,
      "registry/bases/base/blocks/sidebar-07/components/team-switcher.tsx"
    )
    const source = readFileSync(teamSwitcherFile, "utf-8")

    expect(source).not.toContain("data-open:bg-sidebar-accent")
    expect(source).toContain(
      "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
    )
  })

  it("compiled base-vega sidebar.tsx contains aria-expanded classes in sidebarMenuButtonVariants", () => {
    const baseVegaSidebar = resolve(appDir, "styles/base-vega/ui/sidebar.tsx")
    const source = readFileSync(baseVegaSidebar, "utf-8")

    expect(source).not.toContain("data-open:hover:bg-sidebar-accent")
    expect(source).toContain(
      "aria-expanded:bg-sidebar-accent aria-expanded:text-sidebar-accent-foreground"
    )
  })
})
