import { promises as fs } from "fs"
import { Transformer } from "@/src/utils/transformers"
import {
  Node,
  NoSubstitutionTemplateLiteral,
  StringLiteral,
  SyntaxKind,
} from "ts-morph"

const FONT_MARKERS = [
  {
    marker: "cn-font-heading",
    utility: "font-heading",
    supportToken: "--font-heading:",
  },
] as const

const MARKER_REGEX = /\bcn-font-heading\b/
const supportCache = new Map<string, Promise<Set<string>>>()

type StringLikeLiteral = StringLiteral | NoSubstitutionTemplateLiteral

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
  node: StringLikeLiteral,
  supportedMarkers: Set<string>
) {
  const currentValue = node.getLiteralValue()
  if (!MARKER_REGEX.test(currentValue)) {
    return
  }

  const newValue = rewriteFontMarkers(currentValue, supportedMarkers)
  if (newValue !== currentValue) {
    node.setLiteralValue(newValue)
  }
}

function processStringLiterals(node: Node, supportedMarkers: Set<string>) {
  for (const stringLit of node.getDescendantsOfKind(SyntaxKind.StringLiteral)) {
    processStringLiteral(stringLit, supportedMarkers)
  }

  for (const templateLit of node.getDescendantsOfKind(
    SyntaxKind.NoSubstitutionTemplateLiteral
  )) {
    processStringLiteral(templateLit, supportedMarkers)
  }
}

export const transformFont: Transformer = async ({
  sourceFile,
  config,
  supportedFontMarkers,
}) => {
  const supportedMarkers = await getSupportedFontMarkers(
    config.resolvedPaths.tailwindCss,
    supportedFontMarkers
  )

  const attributesToRemove: ReturnType<
    typeof sourceFile.getDescendantsOfKind<typeof SyntaxKind.JsxAttribute>
  > = []

  for (const attr of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const attrName = attr.getNameNode().getText()
    if (attrName !== "className" && attrName !== "classNames") {
      continue
    }

    const initializer = attr.getInitializer()

    if (initializer?.isKind(SyntaxKind.StringLiteral)) {
      const currentValue = initializer.getLiteralValue()
      if (MARKER_REGEX.test(currentValue)) {
        const newValue = rewriteFontMarkers(currentValue, supportedMarkers)
        if (newValue === "") {
          attributesToRemove.push(attr)
        } else if (newValue !== currentValue) {
          initializer.setLiteralValue(newValue)
        }
      }
    }

    if (initializer?.isKind(SyntaxKind.JsxExpression)) {
      processStringLiterals(initializer, supportedMarkers)
    }
  }

  for (const attr of attributesToRemove) {
    attr.remove()
  }

  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getText() === "cva") {
      for (const arg of call.getArguments()) {
        if (arg.isKind(SyntaxKind.StringLiteral)) {
          processStringLiteral(arg, supportedMarkers)
          continue
        }
        if (arg.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
          processStringLiteral(arg, supportedMarkers)
          continue
        }
        processStringLiterals(arg, supportedMarkers)
      }
      continue
    }

    if (call.getExpression().getText() === "mergeProps") {
      processStringLiterals(call, supportedMarkers)
    }
  }

  return sourceFile
}
