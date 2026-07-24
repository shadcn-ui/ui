import os from "os"
import path from "path"
import fs from "fs-extra"
import { afterEach, describe, expect, test } from "vitest"

import { scanImportsForComponents } from "../../src/utils/get-components-from-imports"

const testDir = path.resolve(
  __dirname,
  "../fixtures/scan-imports-test"
)

async function writeSourceFile(relativePath: string, content: string) {
  const fullPath = path.join(testDir, relativePath)
  await fs.ensureDir(path.dirname(fullPath))
  await fs.writeFile(fullPath, content)
}

describe("scanImportsForComponents", () => {
  afterEach(async () => {
    await fs.emptyDir(testDir)
  })

  test("finds default import", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("finds default export import", async () => {
    await writeSourceFile(
      "page.tsx",
      `import Button from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("finds re-export", async () => {
    await writeSourceFile(
      "barrel.ts",
      `export { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("finds dynamic import", async () => {
    await writeSourceFile(
      "lazy.tsx",
      `const Button = await import("@/components/ui/button")\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("finds re-export with rename", async () => {
    await writeSourceFile(
      "barrel.ts",
      `export { Button as MyButton } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("deduplicates multiple occurrences", async () => {
    await writeSourceFile(
      "app.tsx",
      [
        `import { Button } from "@/components/ui/button"`,
        `import { ButtonVariant } from "@/components/ui/button"`,
      ].join("\n")
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("finds multiple distinct components in one file", async () => {
    await writeSourceFile(
      "app.tsx",
      [
        `import { Button } from "@/components/ui/button"`,
        `import { Card } from "@/components/ui/card"`,
      ].join("\n")
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result.sort()).toEqual(["button", "card"])
  })

  test("finds multiple components across multiple files", async () => {
    await writeSourceFile(
      "a.tsx",
      `import { Button } from "@/components/ui/button"\n`
    )
    await writeSourceFile(
      "b.tsx",
      `import { Card } from "@/components/ui/card"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result.sort()).toEqual(["button", "card"])
  })

  test("handles custom alias prefix (package imports)", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Dialog } from "#components/ui/dialog"\n`
    )

    const result = await scanImportsForComponents(testDir, "#components/ui")

    expect(result).toEqual(["dialog"])
  })

  test("handles custom alias prefix with @scope", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Alert } from "@scope/ui/alert"\n`
    )

    const result = await scanImportsForComponents(testDir, "@scope/ui")

    expect(result).toEqual(["alert"])
  })

  test("handles hyphenated component names", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { DataTable } from "@/components/ui/data-table"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["data-table"])
  })

  test("handles dotted component names", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Icon } from "@/components/ui/icon.box"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["icon.box"])
  })

  test("returns empty array when no imports match the alias", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { useState } from "react"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("returns empty array when no source files exist", async () => {
    const result = await scanImportsForComponents(
      path.resolve(__dirname, "../fixtures/scan-imports-empty"),
    "@/components/ui"
    )

    expect(result).toEqual([])
  })

  test("ignores node_modules directory", async () => {
    await writeSourceFile(
      "node_modules/some-lib/index.ts",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores .next directory", async () => {
    await writeSourceFile(
      ".next/server/pages/page.tsx",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores dist directory", async () => {
    await writeSourceFile(
      "dist/output.js",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores build directory", async () => {
    await writeSourceFile(
      "build/bundle.js",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores test files", async () => {
    await writeSourceFile(
      "button.test.tsx",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores spec files", async () => {
    await writeSourceFile(
      "button.spec.ts",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("ignores .d.ts declaration files", async () => {
    await writeSourceFile(
      "types.d.ts",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("scans .js and .jsx files in addition to .ts and .tsx", async () => {
    await writeSourceFile(
      "legacy.js",
      `import { Button } from "@/components/ui/button"\n`
    )
    await writeSourceFile(
      "component.jsx",
      `import { Card } from "@/components/ui/card"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result.sort()).toEqual(["button", "card"])
  })

  test("does not scan non-source file extensions", async () => {
    await writeSourceFile(
      "styles.css",
      `import { Button } from "@/components/ui/button"\n`
    )
    await writeSourceFile(
      "readme.md",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual([])
  })

  test("handles template literal imports", async () => {
    await writeSourceFile(
      "page.tsx",
      "const name = 'button'; const mod = await import(`@/components/ui/button`)\n"
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })

  test("no false positive on similar but non-matching paths", async () => {
    await writeSourceFile(
      "page.tsx",
      [
        `import { Button } from "@/components/ui-button/button"`,
        `import { helper } from "@/components/ui/helper"`,
      ].join("\n")
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["helper"])
  })

  test("alias with trailing content does not match shorter alias", async () => {
    await writeSourceFile(
      "page.tsx",
      [
        `import { A } from "@org/shared/ui/button"`,
        `import { B } from "@org/shared-ui/button"`,
      ].join("\n")
    )

    const result = await scanImportsForComponents(testDir, "@org/shared/ui")

    expect(result).toEqual(["button"])
  })

  test("handles deeply nested source files", async () => {
    await writeSourceFile(
      "src/features/dashboard/components/widget.tsx",
      `import { Widget } from "@/components/ui/widget"\n`
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["widget"])
  })

  test("handles comments before import statement", async () => {
    await writeSourceFile(
      "page.tsx",
      [
        `// This is a comment`,
        `import { Button } from "@/components/ui/button"`,
      ].join("\n")
    )

    const result = await scanImportsForComponents(testDir, "@/components/ui")

    expect(result).toEqual(["button"])
  })
})

describe("scanImportsForComponents error handling", () => {
  afterEach(async () => {
    await fs.emptyDir(testDir)
  })

  test("handles non-existent directory", async () => {
    const result = await scanImportsForComponents(
      "/nonexistent/path",
      "@/components/ui"
    )
    expect(result).toEqual([])
  })

  test("handles alias that doesn't match anything", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Button } from "@/components/ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "#/ui")

    expect(result).toEqual([])
  })

  test("alias with regex special characters is escaped", async () => {
    await writeSourceFile(
      "page.tsx",
      `import { Button } from "$ui/button"\n`
    )

    const result = await scanImportsForComponents(testDir, "$ui")

    expect(result).toEqual(["button"])
  })
})
