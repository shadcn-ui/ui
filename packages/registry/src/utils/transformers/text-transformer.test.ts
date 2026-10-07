import type { Config } from "@/src/utils/get-config"
import { Project, ScriptKind, type SourceFile } from "ts-morph"
import { describe, expect, it } from "vitest"

import { fromTextTransformer } from "./text-transformer"
import { transformIcons } from "./transform-icons"

const project = new Project({ useInMemoryFileSystem: true })
let files = 0

function createSourceFile(text: string) {
  return project.createSourceFile(`/file-${files++}.tsx`, text, {
    scriptKind: ScriptKind.TSX,
  })
}

async function run(
  sourceFile: SourceFile,
  transform: (code: string) => string
) {
  return fromTextTransformer(transform)({
    filename: "component.tsx",
    raw: sourceFile.getFullText(),
    config: {} as Config,
    sourceFile,
  })
}

// Every node of the file's tree, as kind, start and end.
function getTree(sourceFile: SourceFile) {
  return sourceFile
    .getDescendants()
    .map((node) => [node.getKindName(), node.getStart(), node.getEnd()])
}

describe("fromTextTransformer", () => {
  it.each([
    ["CRLF line endings", `"use client"\r\n\r\nexport const a = "b"\r\n`],
    [
      "leading comments and blank lines",
      `\n\n// a\n/** b */\n\nconst a = "b"\n`,
    ],
    ["trailing whitespace", `const a = "b"  \n\t\n  `],
    ["a shebang", `#!/usr/bin/env node\nconsole.log("b")\n`],
  ])("writes text with %s back as it is", async (_, text) => {
    const sourceFile = createSourceFile(`const a = "a"\n`)
    await run(sourceFile, () => text)
    expect(sourceFile.getFullText()).toBe(text)
  })

  it("leaves the SourceFile alone when the text is the same", async () => {
    const sourceFile = createSourceFile(`const a = "a"\r\n`)
    const statement = sourceFile.getStatements()[0]
    expect(await run(sourceFile, (code) => code)).toBe(sourceFile)
    expect(statement.wasForgotten()).toBe(false)
  })

  it("leaves the tree ts-morph parses from the new text", async () => {
    const text = `"use client"\r\n\r\nimport { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"\r\n\r\nexport const a = <IconPlaceholder lucide="CheckIcon" />\r\n`
    const sourceFile = createSourceFile(`const a = "a"\n`)
    await run(sourceFile, () => text)
    const fresh = createSourceFile(text)
    expect(getTree(sourceFile)).toEqual(getTree(fresh))

    // So the next transformer in the chain edits it as it would a fresh file.
    for (const file of [sourceFile, fresh]) {
      await transformIcons({
        filename: "component.tsx",
        raw: text,
        config: { iconLibrary: "lucide" } as Config,
        sourceFile: file,
      })
    }
    expect(sourceFile.getFullText()).toBe(fresh.getFullText())
    expect(sourceFile.getFullText()).not.toBe(text)
  })
})
