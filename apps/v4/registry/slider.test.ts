import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"
import { describe, expect, it } from "vitest"

const registryDir = dirname(fileURLToPath(import.meta.url))

describe("Radix slider registry items", () => {
  it.each(["bases/radix", "new-york-v4"])(
    "%s supports exactOptionalPropertyTypes",
    (registry) => {
      const program = ts.createProgram(
        [resolve(registryDir, registry, "ui/slider.tsx")],
        {
          strict: true,
          exactOptionalPropertyTypes: true,
          noEmit: true,
          skipLibCheck: true,
          types: [],
          target: ts.ScriptTarget.ESNext,
          module: ts.ModuleKind.ESNext,
          moduleResolution: ts.ModuleResolutionKind.Bundler,
          jsx: ts.JsxEmit.ReactJSX,
        }
      )

      const diagnostics = ts.getPreEmitDiagnostics(program)
      expect(
        diagnostics.map((diagnostic) =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")
        )
      ).toEqual([])
    },
    15_000
  )
})
