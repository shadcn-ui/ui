import { readFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"
import { describe, expect, it } from "vitest"

const controls = [
  {
    name: "Checkbox",
    path: "./bases/base/ui/checkbox.tsx",
    root: "CheckboxPrimitive.Root",
  },
  {
    name: "Switch",
    path: "./bases/base/ui/switch.tsx",
    root: "SwitchPrimitive.Root",
  },
  {
    name: "RadioGroupItem",
    path: "./bases/base/ui/radio-group.tsx",
    root: "RadioPrimitive.Root",
  },
] as const

describe("Base UI controls", () => {
  it.each(controls)(
    "renders $name as a native button for sibling labels",
    async ({ path, root }) => {
      const filePath = fileURLToPath(new URL(path, import.meta.url))
      const source = await readFile(filePath, "utf8")
      const start = source.indexOf(`<${root}`)

      expect(start).toBeGreaterThan(-1)

      const openingElement = source.slice(start, start + 200)

      expect(openingElement).toContain("nativeButton")
      expect(openingElement).toContain("render={<button />}")
    }
  )
})
