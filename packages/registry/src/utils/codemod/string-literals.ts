import { types as t } from "@babel/core"
import { parseExpression } from "@babel/parser"

import { applyEdits, type TextEdit } from "./edits"
import { getText } from "./parse"

// The nodes TypeScript parses as a StringLiteral: Babel's string literals and
// directives.
export type StringLiteral = t.StringLiteral | t.DirectiveLiteral

// A TypeScript StringLiteral or NoSubstitutionTemplateLiteral, which is a
// template literal without substitutions.
export type Literal = StringLiteral | t.TemplateLiteral

// The literals of a file as ts-morph's nodes have them. getDescendantsOfKind()
// lists them in source order, getLiteralValue() reads TypeScript's text of
// them, and setLiteralValue() edits the file there and then, so a literal
// visited again reads its new value. TypeScript's JSDoc type expressions have
// string literals too, which are left out.
export class StringLiterals {
  private readonly strings: StringLiteral[] = []
  private readonly templates: t.TemplateLiteral[] = []
  // TypeScript keeps a JSX attribute string as written, where Babel decodes
  // its HTML entities.
  private readonly jsxAttributeValues = new Set<t.Node>()
  private readonly edits = new Map<Literal, TextEdit>()

  constructor(
    private readonly code: string,
    file: t.File
  ) {
    t.traverseFast(file, (node) => {
      if (node.type === "StringLiteral" || node.type === "DirectiveLiteral") {
        this.strings.push(node)
      } else if (
        node.type === "TemplateLiteral" &&
        node.expressions.length === 0
      ) {
        this.templates.push(node)
      } else if (
        node.type === "JSXAttribute" &&
        node.value?.type === "StringLiteral"
      ) {
        this.jsxAttributeValues.add(node.value)
      }
    })
    // traverseFast follows VISITOR_KEYS, which are not in source order.
    this.strings.sort((a, b) => a.start! - b.start!)
    this.templates.sort((a, b) => a.start! - b.start!)
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
function readLiteral(source: string) {
  const literal = parseExpression(source) as t.StringLiteral | t.TemplateLiteral
  return literal.type === "StringLiteral"
    ? literal.value
    : getCookedValue(literal)
}

// A template's value. TypeScript reads an invalid escape as written, where
// Babel has no cooked value, so the raw one stands in.
function getCookedValue(literal: t.TemplateLiteral) {
  const { cooked, raw } = literal.quasis[0].value
  return cooked ?? raw
}
