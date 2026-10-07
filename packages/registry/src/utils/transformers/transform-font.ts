import { promises as fs } from "fs"
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
import { type Transformer } from "@/src/utils/transformers"
import { type types as t } from "@babel/core"

const FONT_MARKERS = [
  {
    marker: "cn-font-heading",
    utility: "font-heading",
    supportToken: "--font-heading:",
  },
] as const

const MARKER_REGEX = /\bcn-font-heading\b/
const supportCache = new Map<string, Promise<Set<string>>>()

async function getSupportedFontMarkers(
  tailwindCssPath?: string,
  extraMarkers: string[] = []
) {
  const supported = new Set(extraMarkers)

  if (!tailwindCssPath) {
    return supported
  }

  let cached = supportCache.get(tailwindCssPath)
  if (!cached) {
    cached = fs
      .readFile(tailwindCssPath, "utf8")
      .then((content) => {
        const projectMarkers = new Set<string>()

        for (const marker of FONT_MARKERS) {
          if (content.includes(marker.supportToken)) {
            projectMarkers.add(marker.marker)
          }
        }

        return projectMarkers
      })
      .catch(() => new Set<string>())

    supportCache.set(tailwindCssPath, cached)
  }

  ;(await cached).forEach((marker) => {
    supported.add(marker)
  })

  return supported
}

function rewriteFontMarkers(
  className: string,
  supportedMarkers: Set<string>
): string {
  let next = className

  for (const marker of FONT_MARKERS) {
    if (!next.includes(marker.marker)) {
      continue
    }

    next = next.replace(
      new RegExp(`\\b${marker.marker}\\b`, "g"),
      supportedMarkers.has(marker.marker) ? marker.utility : ""
    )
  }

  return next.replace(/\s+/g, " ").trim()
}

function processStringLiteral(
  literals: StringLiterals,
  node: Literal,
  supportedMarkers: Set<string>
) {
  const currentValue = literals.getValue(node)
  if (!MARKER_REGEX.test(currentValue)) {
    return
  }

  const newValue = rewriteFontMarkers(currentValue, supportedMarkers)
  if (newValue !== currentValue) {
    literals.setValue(node, newValue)
  }
}

function processStringLiterals(
  literals: StringLiterals,
  node: t.Node,
  supportedMarkers: Set<string>
) {
  for (const stringLit of literals.getStringLiterals(node)) {
    processStringLiteral(literals, stringLit, supportedMarkers)
  }

  for (const templateLit of literals.getTemplateLiterals(node)) {
    processStringLiteral(literals, templateLit, supportedMarkers)
  }
}

// ts-morph edits the file as it goes: the attributes left empty go after the
// className edits, and the cva() and mergeProps() calls are read after that.
export const transformFont: Transformer = async (
  code,
  { config, supportedFontMarkers }
) => {
  const supportedMarkers = await getSupportedFontMarkers(
    config.resolvedPaths.tailwindCss,
    supportedFontMarkers
  )

  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  const attributesToRemove: number[] = []
  const literals = new StringLiterals(code, file)

  getJsxAttributes(file).forEach(({ attribute }, index) => {
    const attrName = getText(code, attribute.name)
    if (attrName !== "className" && attrName !== "classNames") {
      return
    }

    const initializer = attribute.value

    if (initializer?.type === "StringLiteral") {
      const currentValue = literals.getValue(initializer)
      if (MARKER_REGEX.test(currentValue)) {
        const newValue = rewriteFontMarkers(currentValue, supportedMarkers)
        if (newValue === "") {
          attributesToRemove.push(index)
        } else if (newValue !== currentValue) {
          literals.setValue(initializer, newValue)
        }
      }
    }

    if (initializer?.type === "JSXExpressionContainer") {
      processStringLiterals(literals, initializer, supportedMarkers)
    }
  })

  return transformFontCalls(
    removeJsxAttributes(literals.apply(), attributesToRemove),
    supportedMarkers
  )
}

// The cva() and mergeProps() calls of transformFont.
function transformFontCalls(code: string, supportedMarkers: Set<string>) {
  const file = parseTransformInput(code)
  if (!file) {
    return code
  }

  const literals = new StringLiterals(code, file)
  for (const call of getDescendants(file, isCallExpression)) {
    if (getText(code, call.callee) === "cva") {
      for (const arg of call.arguments) {
        if (arg.type === "StringLiteral") {
          processStringLiteral(literals, arg, supportedMarkers)
          continue
        }
        if (arg.type === "TemplateLiteral" && arg.expressions.length === 0) {
          processStringLiteral(literals, arg, supportedMarkers)
          continue
        }
        processStringLiterals(literals, arg, supportedMarkers)
      }
      continue
    }

    if (getText(code, call.callee) === "mergeProps") {
      processStringLiterals(literals, call, supportedMarkers)
    }
  }

  return literals.apply()
}
