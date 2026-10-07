import { getText, parseTransformInput } from "@/src/utils/codemod/parse"
import {
  getStatementsWithComments,
  removeStatement,
} from "@/src/utils/codemod/statements"

import { fromTextTransformer } from "./text-transformer"

// With /g, test() starts where the last match ended, so after a match the next
// call fails and every other file keeps its "use client". Kept on purpose
// until that is fixed (see transform-rsc.test.ts).
const directiveRegex = /^["']use client["']$/g

export const transformRsc = fromTextTransformer(
  (code, { config, filename }) => {
    if (config.rsc) {
      return code
    }

    // ts-morph tests the first expression statement of the tree TypeScript
    // recovers from a file Babel cannot parse. A CSS or Markdown file has one,
    // which fails the test and so resets the regex. A JSON object is a block,
    // and a broken script starts with imports and declarations, which leave it.
    const file = parseTransformInput(code)
    if (!file) {
      if (!/\.([cm]?[jt]sx?|json)$/.test(filename)) {
        directiveRegex.lastIndex = 0
      }
      return code
    }

    // Remove "use client" from the top of the file. TypeScript parses a
    // directive as an expression statement.
    const statements = getStatementsWithComments(code, file.program)
    const index = statements.findIndex(
      ({ node }) =>
        node?.type === "ExpressionStatement" || node?.type === "Directive"
    )
    if (
      index !== -1 &&
      directiveRegex.test(getText(code, statements[index].node!))
    ) {
      return removeStatement(code, statements, index)
    }

    return code
  }
)
