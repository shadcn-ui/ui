import { describe, expect, test } from "vitest"
import { Project, ScriptKind } from "ts-morph"

import { transformIcons } from "../../src/utils/transformers/transform-icons"

// [FORCE-UI] Proves Material Symbols transforms to the path-based default SVGR
// import (?react) with a derived PascalCase tag, while lucide stays a named import.
async function run(source: string, iconLibrary: string) {
  const project = new Project({ useInMemoryFileSystem: true })
  const sourceFile = project.createSourceFile("test.tsx", source, {
    scriptKind: ScriptKind.TSX,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await transformIcons({ sourceFile, config: { iconLibrary } } as any)
  return result.getFullText()
}

const SOURCE = `import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function Demo() {
  return (
    <IconPlaceholder
      lucide="ChevronDownIcon"
      materialSymbols="keyboard_arrow_down"
      tabler="IconChevronDown"
      className="size-4"
    />
  )
}
`

describe("transformIcons", () => {
  test("materialSymbols -> default ?react import + PascalCase tag", async () => {
    const out = await run(SOURCE, "materialSymbols")
    expect(out).toContain(
      'import IconKeyboardArrowDown from "@material-symbols/svg-400/rounded/keyboard_arrow_down.svg?react"'
    )
    expect(out).toContain('<IconKeyboardArrowDown className="size-4" />')
    expect(out).not.toContain("IconPlaceholder")
    expect(out).not.toContain("lucide=")
  })

  test("lucide -> named import (unchanged behavior)", async () => {
    const out = await run(SOURCE, "lucide")
    expect(out).toContain('import { ChevronDownIcon } from "lucide-react"')
    expect(out).toContain('<ChevronDownIcon className="size-4" />')
    expect(out).not.toContain("materialSymbols")
  })
})
