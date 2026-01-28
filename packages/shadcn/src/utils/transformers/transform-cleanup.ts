import { Transformer } from "@/src/utils/transformers"
import { Project, ScriptKind, SourceFile, SyntaxKind } from "ts-morph"

// Regex to match cn-* marker classes (e.g., cn-rtl-flip, cn-logical-sides).
const CN_MARKER_REGEX = /\bcn-[a-z-]+\b/g

// Helper to strip all cn-* marker classes from a className string.
export function stripCnMarkers(className: string) {
  return className.replace(CN_MARKER_REGEX, "").replace(/\s+/g, " ").trim()
}

// Processes a string literal and strips cn-* markers.
function processStringLiteral(
  node: ReturnType<
    typeof import("ts-morph").SourceFile.prototype.getDescendantsOfKind
  >[number]
) {
  if (!node.isKind(SyntaxKind.StringLiteral)) {
    return
  }

  const currentValue = node.getLiteralValue()
  if (CN_MARKER_REGEX.test(currentValue)) {
    // Reset regex lastIndex since we're using global flag.
    CN_MARKER_REGEX.lastIndex = 0
    const newValue = stripCnMarkers(currentValue)
    if (newValue !== currentValue) {
      node.setLiteralValue(newValue)
    }
  }
  // Reset regex lastIndex for next iteration.
  CN_MARKER_REGEX.lastIndex = 0
}

// Apply cleanup to a SourceFile directly (used by transformDirection).
export function applyCleanup(sourceFile: SourceFile) {
  // Collect attributes to remove (can't remove while iterating).
  const attributesToRemove: ReturnType<
    typeof sourceFile.getDescendantsOfKind<typeof SyntaxKind.JsxAttribute>
  > = []

  // Process all JSX className attributes.
  for (const attr of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const attrName = attr.getNameNode().getText()
    if (attrName !== "className" && attrName !== "classNames") {
      continue
    }

    const initializer = attr.getInitializer()

    // className="..."
    if (initializer?.isKind(SyntaxKind.StringLiteral)) {
      const currentValue = initializer.getLiteralValue()
      if (CN_MARKER_REGEX.test(currentValue)) {
        CN_MARKER_REGEX.lastIndex = 0
        const newValue = stripCnMarkers(currentValue)
        if (newValue === "") {
          // Remove the entire attribute if className becomes empty.
          attributesToRemove.push(attr)
        } else if (newValue !== currentValue) {
          initializer.setLiteralValue(newValue)
        }
      }
      CN_MARKER_REGEX.lastIndex = 0
    }

    // className={...} or classNames={{...}}
    if (initializer?.isKind(SyntaxKind.JsxExpression)) {
      for (const stringLit of initializer.getDescendantsOfKind(
        SyntaxKind.StringLiteral
      )) {
        processStringLiteral(stringLit)
      }
    }
  }

  // Remove empty className attributes.
  for (const attr of attributesToRemove) {
    attr.remove()
  }

  // Process cva() calls.
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getText() !== "cva") {
      continue
    }

    for (const arg of call.getArguments()) {
      if (arg.isKind(SyntaxKind.StringLiteral)) {
        processStringLiteral(arg)
      }
      // Handle object arguments (variants).
      for (const stringLit of arg.getDescendantsOfKind(
        SyntaxKind.StringLiteral
      )) {
        processStringLiteral(stringLit)
      }
    }
  }

  // Process mergeProps() calls.
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getText() !== "mergeProps") {
      continue
    }

    for (const stringLit of call.getDescendantsOfKind(
      SyntaxKind.StringLiteral
    )) {
      processStringLiteral(stringLit)
    }
  }
}

export const transformCleanup: Transformer = async ({ sourceFile }) => {
  applyCleanup(sourceFile)
  return sourceFile
}

// Standalone function to clean up cn-* markers from source code.
// This is used by the build script and doesn't require a config object.
export async function cleanupMarkers(source: string) {
  const project = new Project({
    useInMemoryFileSystem: true,
  })

  const sourceFile = project.createSourceFile("component.tsx", source, {
    scriptKind: ScriptKind.TSX,
    overwrite: true,
  })

  applyCleanup(sourceFile)

  return sourceFile.getText()
}
