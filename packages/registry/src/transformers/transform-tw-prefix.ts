import { applyEdits } from "@/src/codemod/edits"
import { getReplacementText } from "@/src/codemod/indentation"
import { getJsxAttributes } from "@/src/codemod/jsx-attributes"
import {
  getPropertyName,
  isPropertyAssignment,
} from "@/src/codemod/object-literals"
import {
  getDescendants,
  getText,
  isCallExpression,
  parseTransformInput,
} from "@/src/codemod/parse"
import { type Transformer } from "@/src/transformers"
import { types as t } from "@babel/core"

import {
  getProjectTailwindVersionFromConfig,
  TailwindVersion,
} from "../get-project-info"
import { splitClassName } from "./transform-css-vars"

export const transformTwPrefixes: Transformer = async (code, { config }) => {
  const prefix = config.tailwind?.prefix
  if (!prefix) {
    return code
  }
  const tailwindVersion = await getProjectTailwindVersionFromConfig(config)

  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // ts-morph's replaceWithText() on each class string: always in double
  // quotes, and without the quotes the string's text has inside it. A string
  // visited again reads the text the visit before it wrote.
  const texts = new Map<t.StringLiteral, string>()
  for (const literal of getClassNameStrings(code, file)) {
    const text = texts.get(literal) ?? getText(code, literal)
    const prefixed = applyPrefix(
      text.replace(/"|'/g, ""),
      prefix,
      tailwindVersion
    )
    texts.set(
      literal,
      getReplacementText(code, literal.start!, `"${prefixed}"`)
    )
  }

  // ts-morph rejects an edit that changes the tree, which stripping the
  // quotes can do: `'\''` becomes `"tw:\"`, a string that runs on past its
  // closing quote. ts-morph throws there, where this writes it as it is.
  return applyEdits(
    code,
    Array.from(texts, ([literal, text]) => ({
      start: literal.start!,
      end: literal.end!,
      text,
    }))
  )
}

// The class strings the tw-prefix and rtl transformers visit, in the order
// they visit them: the cva() calls, then the className and classNames
// attributes. A string can come more than once, as in nested cva variants,
// and each visit edits what the visit before it left. Their edits only
// replace strings, so the tree stays the one these were found in.
export function getClassNameStrings(code: string, file: t.File) {
  const strings: t.StringLiteral[] = []

  // cva(base, { variants: { ... } }): the strings of the properties under
  // each property under the first variants property.
  for (const call of getDescendants(file, isCallExpression)) {
    if (getText(code, call.callee) !== "cva") {
      continue
    }

    const [base, options] = call.arguments
    if (base?.type === "StringLiteral") {
      strings.push(base)
    }
    if (options?.type !== "ObjectExpression") {
      continue
    }
    const variants = getPropertyAssignments(options).find(
      (property) => getPropertyName(code, property) === "variants"
    )
    for (const variant of variants ? getPropertyAssignments(variants) : []) {
      for (const property of getPropertyAssignments(variant)) {
        if (property.value.type === "StringLiteral") {
          strings.push(property.value)
        }
      }
    }
  }

  for (const { attribute } of getJsxAttributes(file)) {
    const name = getText(code, attribute.name)
    const { value } = attribute

    // className="..." and className={...}, where the first cn() call is read.
    if (name === "className") {
      if (value?.type === "StringLiteral") {
        strings.push(value)
      }
      if (value?.type === "JSXExpressionContainer") {
        const cn = getDescendants(value, isCallExpression).find(
          (call) => getText(code, call.callee) === "cn"
        )
        for (const arg of cn?.arguments ?? []) {
          strings.push(...getArgumentStrings(arg, { binary: true }))
        }
      }
    }

    // classNames={{ ... }}: the arguments of a property's call, then the
    // property's own string, unless the property is named variant.
    if (name === "classNames" && value?.type === "JSXExpressionContainer") {
      for (const property of getPropertyAssignments(attribute)) {
        if (isCallExpression(property.value)) {
          for (const arg of property.value.arguments) {
            strings.push(...getArgumentStrings(arg, { binary: false }))
          }
        }
        if (
          property.value.type === "StringLiteral" &&
          getPropertyName(code, property) !== "variant"
        ) {
          strings.push(property.value)
        }
      }
    }
  }

  return strings
}

// The strings ts-morph reads in a call argument: the argument itself, or the
// operands of a ternary, and with binary, of a binary expression, that are
// strings (getChildrenOfKind(SyntaxKind.StringLiteral)). TypeScript's
// BinaryExpression is Babel's binary, logical and assignment expressions.
export function getArgumentStrings(
  arg: t.CallExpression["arguments"][number],
  { binary }: { binary: boolean }
) {
  const operands =
    arg.type === "ConditionalExpression"
      ? [arg.test, arg.consequent, arg.alternate]
      : binary &&
          (arg.type === "BinaryExpression" ||
            arg.type === "LogicalExpression" ||
            arg.type === "AssignmentExpression")
        ? [arg.left, arg.right]
        : [arg]

  return operands.filter((node) => node.type === "StringLiteral")
}

// ts-morph's getDescendantsOfKind(SyntaxKind.PropertyAssignment) on node: the
// `key: value` members of the object literals under it, and of node itself,
// in source order. TypeScript's destructuring assignment targets are object
// literals too, which Babel parses as patterns, so they are left out.
export function getPropertyAssignments(node: t.Node) {
  const objects = getDescendants(node, t.isObjectExpression)
  if (t.isObjectExpression(node)) {
    objects.unshift(node)
  }

  return objects
    .flatMap((object) => object.properties.filter(isPropertyAssignment))
    .sort((a, b) => a.start! - b.start!)
}

export function applyPrefix(
  input: string,
  prefix: string = "",
  tailwindVersion: TailwindVersion
) {
  if (tailwindVersion === "v3") {
    return input
      .split(" ")
      .map((className) => {
        const [variant, value, modifier] = splitClassName(className)
        if (variant) {
          return modifier
            ? `${variant}:${prefix}${value}/${modifier}`
            : `${variant}:${prefix}${value}`
        } else {
          return modifier
            ? `${prefix}${value}/${modifier}`
            : `${prefix}${value}`
        }
      })
      .join(" ")
  }

  return input
    .split(" ")
    .map((className) =>
      className.indexOf(`${prefix}:`) === 0
        ? className
        : `${prefix}:${className.trim()}`
    )
    .join(" ")
}

export function applyPrefixesCss(
  css: string,
  prefix: string,
  tailwindVersion: TailwindVersion
) {
  const lines = css.split("\n")
  for (let line of lines) {
    if (line.includes("@apply")) {
      const originalTWCls = line.replace("@apply", "").trim()
      const prefixedTwCls = applyPrefix(originalTWCls, prefix, tailwindVersion)
      css = css.replace(originalTWCls, prefixedTwCls)
    }
  }
  return css
}
