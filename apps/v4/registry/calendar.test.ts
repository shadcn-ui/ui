import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const calendarFiles = [
  "../registry/new-york-v4/ui/calendar.tsx",
  "../registry/bases/base/ui/calendar.tsx",
  "../registry/bases/radix/ui/calendar.tsx",
  "../styles/base-luma/ui/calendar.tsx",
  "../styles/base-lyra/ui/calendar.tsx",
  "../styles/base-maia/ui/calendar.tsx",
  "../styles/base-mira/ui/calendar.tsx",
  "../styles/base-nova/ui/calendar.tsx",
  "../styles/base-nova/ui-rtl/calendar.tsx",
  "../styles/base-vega/ui/calendar.tsx",
  "../styles/radix-luma/ui/calendar.tsx",
  "../styles/radix-lyra/ui/calendar.tsx",
  "../styles/radix-maia/ui/calendar.tsx",
  "../styles/radix-mira/ui/calendar.tsx",
  "../styles/radix-nova/ui/calendar.tsx",
  "../styles/radix-nova/ui-rtl/calendar.tsx",
  "../styles/radix-vega/ui/calendar.tsx",
] as const

describe("calendar root width", () => {
  it("uses the parent container width across shipped calendar variants", async () => {
    const contents = await Promise.all(
      calendarFiles.map((file) => readFile(path.resolve(__dirname, file), "utf8"))
    )

    for (const content of contents) {
      expect(content).toContain('root: cn("w-full", defaultClassNames.root)')
      expect(content).not.toContain('root: cn("w-fit", defaultClassNames.root)')
    }
  })
})
