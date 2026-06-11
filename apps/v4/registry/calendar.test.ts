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
  "../styles/base-sera/ui/calendar.tsx",
  "../styles/base-vega/ui/calendar.tsx",
  "../styles/radix-luma/ui/calendar.tsx",
  "../styles/radix-lyra/ui/calendar.tsx",
  "../styles/radix-maia/ui/calendar.tsx",
  "../styles/radix-mira/ui/calendar.tsx",
  "../styles/radix-nova/ui/calendar.tsx",
  "../styles/radix-nova/ui-rtl/calendar.tsx",
  "../styles/radix-sera/ui/calendar.tsx",
  "../styles/radix-vega/ui/calendar.tsx",
] as const

describe("calendar fluid width", () => {
  it("uses w-full min-w-0 root and table-fixed month_grid across all variants", async () => {
    const contents = await Promise.all(
      calendarFiles.map((file) => readFile(path.resolve(__dirname, file), "utf8"))
    )

    for (const [i, content] of contents.entries()) {
      expect(content, calendarFiles[i]).toContain(
        'root: cn("w-full min-w-0", defaultClassNames.root)'
      )
      expect(content, calendarFiles[i]).not.toContain(
        'root: cn("w-fit", defaultClassNames.root)'
      )
      expect(content, calendarFiles[i]).toContain("month_grid")
      expect(content, calendarFiles[i]).toContain("table-fixed")
      expect(content, calendarFiles[i]).not.toContain('table: "w-full border-collapse"')
    }
  })
})
