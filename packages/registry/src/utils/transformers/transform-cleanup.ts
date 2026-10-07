import {
  getJsxAttributes,
  removeJsxAttributes,
} from "@/src/utils/codemod/jsx-attributes"
import {
  getDescendants,
  getText,
  isCallExpression,
  parseTransformInput,
} from "@/src/utils/codemod/parse"
import {
  StringLiterals,
  type Literal,
} from "@/src/utils/codemod/string-literals"
import { type types as t } from "@babel/core"

import { fromTextTransformer, transformSourceText } from "./text-transformer"

// Generic cleanup should leave font markers alone until transformFont runs.
const PRESERVED_CN_MARKERS = new Set(["cn-font-heading"])
const CN_MARKER_REGEX = /\bcn-[a-z-]+\b/

function isRemovableCnMarker(token: string) {
  return CN_MARKER_REGEX.test(token) && !PRESERVED_CN_MARKERS.has(token)
}

// Helper to strip all cn-* marker classes from a className string.
export function stripCnMarkers(className: string) {
  return className
    .split(/\s+/)
    .filter((token) => token.length > 0 && !isRemovableCnMarker(token))
    .join(" ")
}

function hasRemovableCnMarker(className: string) {
  return className.split(/\s+/).some(isRemovableCnMarker)
}

// Processes a string-like literal and strips cn-* markers.
function processStringLiteral(literals: StringLiterals, node: Literal) {
  const currentValue = literals.getValue(node)
  if (!hasRemovableCnMarker(currentValue)) {
    return
  }

  const newValue = stripCnMarkers(currentValue)
  if (newValue !== currentValue) {
    literals.setValue(node, newValue)
  }
}

function processStringLiterals(literals: StringLiterals, node: t.Node) {
  for (const stringLit of literals.getStringLiterals(node)) {
    processStringLiteral(literals, stringLit)
  }

  for (const templateLit of literals.getTemplateLiterals(node)) {
    processStringLiteral(literals, templateLit)
  }
}

// Strips the cn-* markers from code. ts-morph edits the file as it goes: the
// attributes left empty go after the className edits, and the cva() and
// mergeProps() calls are read after that.
function cleanup(code: string) {
  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  // Collect attributes to remove (can't remove while iterating).
  const attributesToRemove: number[] = []
  const literals = new StringLiterals(code, file)

  // Process all JSX className attributes.
  getJsxAttributes(file).forEach(({ attribute }, index) => {
    const attrName = getText(code, attribute.name)
    if (attrName !== "className" && attrName !== "classNames") {
      return
    }

    const initializer = attribute.value

    // className="..."
    if (initializer?.type === "StringLiteral") {
      const currentValue = literals.getValue(initializer)
      if (hasRemovableCnMarker(currentValue)) {
        const newValue = stripCnMarkers(currentValue)
        if (newValue === "") {
          // Remove the entire attribute if className becomes empty.
          attributesToRemove.push(index)
        } else if (newValue !== currentValue) {
          literals.setValue(initializer, newValue)
        }
      }
    }

    // className={...} or classNames={{...}}
    if (initializer?.type === "JSXExpressionContainer") {
      processStringLiterals(literals, initializer)
    }
  })

  // Remove empty className attributes.
  return cleanupCalls(removeJsxAttributes(literals.apply(), attributesToRemove))
}

// The cva() and mergeProps() calls of cleanup().
function cleanupCalls(code: string) {
  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  const literals = new StringLiterals(code, file)
  const calls = getDescendants(file, isCallExpression)

  // Process cva() calls.
  for (const call of calls) {
    if (getText(code, call.callee) !== "cva") {
      continue
    }

    for (const arg of call.arguments) {
      if (arg.type === "StringLiteral") {
        processStringLiteral(literals, arg)
        continue
      }
      if (arg.type === "TemplateLiteral" && arg.expressions.length === 0) {
        processStringLiteral(literals, arg)
        continue
      }
      // Handle object arguments (variants).
      processStringLiterals(literals, arg)
    }
  }

  // Process mergeProps() calls.
  for (const call of calls) {
    if (getText(code, call.callee) !== "mergeProps") {
      continue
    }

    processStringLiterals(literals, call)
  }

  return literals.apply()
}

export const transformCleanup = fromTextTransformer(cleanup)

// Standalone function to clean up cn-* markers from source code.
// This is used by the build script and doesn't require a config object.
export async function cleanupMarkers(source: string) {
  return transformSourceText(source, cleanup)
}
