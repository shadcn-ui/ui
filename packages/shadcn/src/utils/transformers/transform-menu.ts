import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

// Transforms cn-menu-target class based on config.menuColor.
// If menuColor is "inverted", replaces cn-menu-target with "dark".
// Otherwise, removes cn-menu-target entirely.
export const transformMenu: Transformer = async ({ sourceFile, config }) => {
  const menuColor = config.menuColor

  // If menuColor is not set or is "default", we remove the placeholder.
  const replacement = menuColor === "inverted" ? "dark" : ""

  for (const attr of sourceFile.getDescendantsOfKind(SyntaxKind.JsxAttribute)) {
    const attrName = attr.getNameNode().getText()
    if (attrName !== "className") {
      continue
    }

    const initializer = attr.getInitializer()
    if (!initializer) {
      continue
    }

    const text = initializer.getText()
    if (!text.includes("cn-menu-target")) {
      continue
    }

    // Replace cn-menu-target with the replacement value.
    let newText = text.replace(/cn-menu-target/g, replacement)

    // Clean up extra spaces if we removed the class.
    if (!replacement) {
      // Remove double spaces.
      newText = newText.replace(/\s{2,}/g, " ")
      // Clean up leading/trailing spaces in strings.
      newText = newText.replace(/"\s+/g, '"')
      newText = newText.replace(/\s+"/g, '"')
      // Clean up empty strings in cn() calls.
      newText = newText.replace(/,\s*""\s*,/g, ",")
      newText = newText.replace(/\(\s*""\s*,/g, "(")
      newText = newText.replace(/,\s*""\s*\)/g, ")")
    }

    attr.setInitializer(newText)
  }

  return sourceFile
}
