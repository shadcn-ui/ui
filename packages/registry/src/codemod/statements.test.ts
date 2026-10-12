import { describe, expect, it } from "vitest"

import { parseModule } from "./parse"
import {
  addImportDeclaration,
  getStatementsWithComments,
  insertStatement,
  type Statement,
} from "./statements"

function addInterImport(code: string) {
  return addImportDeclaration(code, "next/font/google", "Inter")
}

function insertInter(code: string, index: number) {
  const statements = getStatementsWithComments(code, parseModule(code).program)
  const isVariableStatement = ({ node }: Statement) =>
    node?.type === "VariableDeclaration"
  return insertStatement(
    code,
    statements,
    index,
    "const inter = Inter();",
    isVariableStatement
  ).code
}

describe("addImportDeclaration", () => {
  it("adds the import after the last import", () => {
    expect(
      addInterImport(`import a from "a"\nimport b from "b"\n\nconst x = 1\n`)
    ).toMatchInlineSnapshot(`
      "import a from "a"
      import b from "b"
      import { Inter } from "next/font/google";

      const x = 1
      "
    `)
  })

  it("adds the import after a leading block comment", () => {
    expect(addInterImport(`/* License. */\n\nexport default function L() {}\n`))
      .toMatchInlineSnapshot(`
        "/* License. */
        import { Inter } from "next/font/google";

        export default function L() {}
        "
      `)
  })

  it("adds the import above a leading JSDoc or line comment", () => {
    expect(
      addInterImport(
        `/**\n * License.\n */\n\nexport default function L() {}\n`
      )
    ).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";

      /**
       * License.
       */

      export default function L() {}
      "
    `)
    expect(addInterImport(`// License.\n\nexport default function L() {}\n`))
      .toMatchInlineSnapshot(`
        "import { Inter } from "next/font/google";

        // License.

        export default function L() {}
        "
      `)
  })

  it("adds the import above a directive", () => {
    expect(addInterImport(`"use client"\n\nexport default function L() {}\n`))
      .toMatchInlineSnapshot(`
        "import { Inter } from "next/font/google";

        "use client"

        export default function L() {}
        "
      `)
  })

  it("adds the import to an empty file", () => {
    expect(addInterImport("")).toMatchInlineSnapshot(`
      "import { Inter } from "next/font/google";
      "
    `)
  })
})

describe("insertStatement", () => {
  it("separates the statement from neighbors of another kind with a blank line", () => {
    expect(
      insertInter(`import a from "a"\nexport default function L() {}\n`, 1)
    ).toMatchInlineSnapshot(`
      "import a from "a"

      const inter = Inter();

      export default function L() {}
      "
    `)
  })

  it("puts no blank line between statements of the same kind", () => {
    expect(insertInter(`import a from "a"\nconst x = 1\n`, 1))
      .toMatchInlineSnapshot(`
        "import a from "a"

        const inter = Inter();
        const x = 1
        "
      `)
    expect(insertInter(`const x = 1\nexport default function L() {}\n`, 1))
      .toMatchInlineSnapshot(`
        "const x = 1
        const inter = Inter();

        export default function L() {}
        "
      `)
  })

  it("ends the file with a line break", () => {
    expect(insertInter(`import a from "a"`, 1)).toMatchInlineSnapshot(`
      "import a from "a"

      const inter = Inter();
      "
    `)
  })
})
