import { types as t } from "@babel/core"
import { parseExpression } from "@babel/parser"

import { applyEdits, type TextEdit } from "./edits"
import { getDescendants, getText } from "./parse"

// The nodes TypeScript parses as a StringLiteral: Babel's string literals and
// directives.
type StringLiteral = t.StringLiteral | t.DirectiveLiteral

// A TypeScript StringLiteral or NoSubstitutionTemplateLiteral, which is a
// template literal without substitutions.
export type Literal = StringLiteral | t.TemplateLiteral

// The literals of a file as ts-morph's nodes have them. getDescendantsOfKind()
// lists them in source order, getLiteralValue() reads TypeScript's text of
// them, and setLiteralValue() edits the file there and then, so a literal
// visited again reads its new value. TypeScript's JSDoc type expressions have
// string literals too, which are left out.
export class StringLiterals {
  private readonly strings: StringLiteral[]
  private readonly templates: t.TemplateLiteral[]
  // TypeScript keeps a JSX attribute string as written, where Babel decodes
  // its HTML entities.
  private readonly jsxAttributeValues: Set<Literal>
  private readonly edits = new Map<Literal, TextEdit>()

  constructor(
    private readonly code: string,
    file: t.File
  ) {
    this.strings = getDescendants(
      file,
      (node): node is StringLiteral =>
        t.isStringLiteral(node) || t.isDirectiveLiteral(node)
    )
    this.templates = getDescendants(
      file,
      (node): node is t.TemplateLiteral =>
        t.isTemplateLiteral(node) && node.expressions.length === 0
    )
    this.jsxAttributeValues = new Set(
      getDescendants(file, t.isJSXAttribute).flatMap(({ value }) =>
        value?.type === "StringLiteral" ? [value] : []
      )
    )
  }

  // ts-morph's getDescendantsOfKind(SyntaxKind.StringLiteral) on the file, or
  // on container.
  getStringLiterals(container?: t.Node) {
    return container
      ? this.strings.filter((literal) => isWithin(literal, container))
      : this.strings
  }

  // ts-morph's getDescendantsOfKind(SyntaxKind.NoSubstitutionTemplateLiteral).
  getTemplateLiterals(container?: t.Node) {
    return container
      ? this.templates.filter((literal) => isWithin(literal, container))
      : this.templates
  }

  // ts-morph's getLiteralValue(), the text TypeScript reads from the literal.
  getValue(literal: Literal) {
    const edit = this.edits.get(literal)
    if (this.jsxAttributeValues.has(literal)) {
      return edit?.text ?? this.code.slice(literal.start! + 1, literal.end! - 1)
    }
    if (edit) {
      const quote = this.code[literal.start!]
      return readLiteral(`${quote}${edit.text}${quote}`)
    }

    switch (literal.type) {
      case "StringLiteral":
        return literal.value
      // Babel keeps a directive as written.
      case "DirectiveLiteral":
        return readLiteral(getText(this.code, literal))
      case "TemplateLiteral":
        return getCookedValue(literal)
    }
  }

  // ts-morph's setLiteralValue(value), which replaces the text between the
  // quotes. A string keeps its quotes, and escapes them and line breaks in
  // value, but not backslashes. A template takes value as written.
  setValue(literal: Literal, value: string) {
    const quote = this.code[literal.start!] === "'" ? "'" : '"'
    this.edits.set(literal, {
      start: literal.start! + 1,
      end: literal.end! - 1,
      text:
        literal.type === "TemplateLiteral"
          ? value
          : escapeForWithinString(value, quote),
    })
  }

  // The code with the values set.
  apply() {
    return applyEdits(this.code, Array.from(this.edits.values()))
  }
}

// ts-morph's StringUtils.escapeForWithinString.
function escapeForWithinString(value: string, quote: string) {
  return value
    .split(quote)
    .join(`\\${quote}`)
    .replace(/(\r?\n)/g, "\\$1")
}

function isWithin(node: t.Node, container: t.Node) {
  return (
    node !== container &&
    container.start! <= node.start! &&
    node.end! <= container.end!
  )
}

// What TypeScript reads from a string or template literal, given as source.
// TypeScript's scanner never throws. Babel recovers from an invalid escape,
// but not from a string whose last backslash escapes its closing quote, which
// setValue() writes for a value that ends in one; its text stands in.
function readLiteral(source: string) {
  try {
    const literal = parseExpression(source, { errorRecovery: true }) as
      | t.StringLiteral
      | t.TemplateLiteral
    return literal.type === "StringLiteral"
      ? literal.value
      : getCookedValue(literal)
  } catch {
    return source.slice(1, -1)
  }
}

// A template's value. Babel has no cooked value for a template with an
// invalid escape, which TypeScript keeps as written, so the whole raw text
// stands in, other escapes and all.
function getCookedValue(literal: t.TemplateLiteral) {
  const { cooked, raw } = literal.quasis[0].value
  return cooked ?? raw
}
