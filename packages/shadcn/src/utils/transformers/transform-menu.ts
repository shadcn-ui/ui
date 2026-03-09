import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

// Transforms cn-menu-target and cn-menu-translucent classes based on config.menuColor.
// If menuColor is "inverted", replaces cn-menu-target with "dark" and removes cn-menu-translucent.
// If menuColor is "translucent", removes cn-menu-target and inlines cn-menu-translucent styles.
// If menuColor is "translucent-inverted", replaces cn-menu-target with "dark" and inlines cn-menu-translucent styles.
// Otherwise, removes both cn-menu-target and cn-menu-translucent.
export const transformMenu: Transformer = async ({
  sourceFile,
  config,
  styleMap,
}) => {
  const menuColor = config.menuColor
  const isTranslucent =
    menuColor === "translucent" || menuColor === "translucent-inverted"

  // Resolve the inlined classes for cn-menu-translucent from the style map.
  const translucentClasses = isTranslucent
    ? styleMap?.["cn-menu-translucent"] ?? ""
    : ""

  for (const attr of sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxAttribute
  )) {
    const attrName = attr.getNameNode().getText()
    if (attrName !== "className") {
      continue
    }

    const initializer = attr.getInitializer()
    if (!initializer) {
      continue
    }

    const text = initializer.getText()
    if (
      !text.includes("cn-menu-target") &&
      !text.includes("cn-menu-translucent")
    ) {
      continue
    }

    let newText = text
    let needsCleanup = false

    if (menuColor === "inverted" || menuColor === "translucent-inverted") {
      // Replace cn-menu-target with "dark".
      newText = newText.replace(/cn-menu-target/g, "dark")
    } else {
      // Remove cn-menu-target for both "translucent" and "default".
      newText = newText.replace(/cn-menu-target/g, "")
      needsCleanup = true
    }

    if (isTranslucent) {
      if (translucentClasses) {
        // Inline the translucent styles from the style map.
        newText = newText.replace(/cn-menu-translucent/g, translucentClasses)
      }
      // If no style map, keep cn-menu-translucent as-is (fallback).
    } else {
      // Remove cn-menu-translucent.
      if (newText.includes("cn-menu-translucent")) {
        newText = newText.replace(/cn-menu-translucent/g, "")
        needsCleanup = true
      }
    }

    // Clean up extra spaces only when classes were removed.
    if (needsCleanup) {
      newText = newText.replace(/\s{2,}/g, " ")
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
