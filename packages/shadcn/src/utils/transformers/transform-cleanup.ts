import { Transformer } from "@/src/utils/transformers"
import {
  NoSubstitutionTemplateLiteral,
  Node,
  Project,
  ScriptKind,
  SourceFile,
  StringLiteral,
  SyntaxKind,
} from "ts-morph"

// Regex to match cn-* marker classes (e.g., cn-rtl-flip, cn-logical-sides).
const CN_MARKER_REGEX = /\bcn-[a-z-]+\b/
const CN_MARKER_REGEX_GLOBAL = /\bcn-[a-z-]+\b/g

// Helper to strip all cn-* marker classes from a className string.
export function stripCnMarkers(className: string) {
  return className
    .replace(CN_MARKER_REGEX_GLOBAL, "")
    .replace(/\s+/g, " ")
    .trim()
}

type StringLikeLiteral = StringLiteral | NoSubstitutionTemplateLiteral

// Processes a string-like literal and strips cn-* markers.
function processStringLiteral(node: StringLikeLiteral) {
  const currentValue = node.getLiteralValue()
  if (!CN_MARKER_REGEX.test(currentValue)) {
    return
  }

  const newValue = stripCnMarkers(currentValue)
  if (newValue !== currentValue) {
    node.setLiteralValue(newValue)
  }
}

function processStringLiterals(node: Node) {
  for (const stringLit of node.getDescendantsOfKind(SyntaxKind.StringLiteral)) {
    processStringLiteral(stringLit)
  }

  for (const templateLit of node.getDescendantsOfKind(
    SyntaxKind.NoSubstitutionTemplateLiteral
  )) {
    processStringLiteral(templateLit)
  }
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
        const newValue = stripCnMarkers(currentValue)
        if (newValue === "") {
          // Remove the entire attribute if className becomes empty.
          attributesToRemove.push(attr)
        } else if (newValue !== currentValue) {
          initializer.setLiteralValue(newValue)
        }
      }
    }

    // className={...} or classNames={{...}}
    if (initializer?.isKind(SyntaxKind.JsxExpression)) {
      processStringLiterals(initializer)
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
        continue
      }
      if (arg.isKind(SyntaxKind.NoSubstitutionTemplateLiteral)) {
        processStringLiteral(arg)
        continue
      }
      // Handle object arguments (variants).
      processStringLiterals(arg)
    }
  }

  // Process mergeProps() calls.
  for (const call of sourceFile.getDescendantsOfKind(
    SyntaxKind.CallExpression
  )) {
    if (call.getExpression().getText() !== "mergeProps") {
      continue
    }

    processStringLiterals(call)
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
