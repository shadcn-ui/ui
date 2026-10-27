import { getText, parseTransformInput } from "@/src/codemod/parse"
import {
  getStatementsWithComments,
  removeStatement,
} from "@/src/codemod/statements"
import { type Transformer } from "@/src/transformers"

// The pattern is anchored with ^...$, so the global flag is not needed. Without
// /g, test() does not keep lastIndex between calls and every "use client" file
// is handled consistently.
const directiveRegex = /^["']use client["']$/

export const transformRsc: Transformer = (code, { config }) => {
  if (config.rsc) {
    return code
  }

  const file = parseTransformInput(code)
  if (!file) {
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
