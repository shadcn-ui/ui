import { Transformer } from "@/src/utils/transformers"
import { JsxElement, SyntaxKind } from "ts-morph"

// Elements that require nativeButton={false} when used as render prop.
// These are non-button elements that don't have native button semantics.
const ELEMENTS_REQUIRING_NATIVE_BUTTON_FALSE = [
  "a",
  "span",
  "div",
  "Link",
  "label",
  "Label",
]

interface TransformInfo {
  parentElement: JsxElement
  parentTagName: string
  childTagName: string
  childProps: string
  childChildren: string
  needsNativeButton: boolean
}

export const transformAsChild: Transformer = async ({ sourceFile, config }) => {
  // Only run for base- styles.
  if (!config.style?.startsWith("base-")) {
    return sourceFile
  }

  // Collect all transformations first, then apply them in reverse order.
  // This prevents issues with invalidated nodes when modifying the tree.
  const transformations: TransformInfo[] = []

  // Find all JSX elements with asChild attribute.
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)

  for (const jsxElement of jsxElements) {
    const openingElement = jsxElement.getOpeningElement()
    const asChildAttr = openingElement.getAttribute("asChild")

    if (!asChildAttr) {
      continue
    }

    const parentTagName = openingElement.getTagNameNode().getText()
    const children = jsxElement.getJsxChildren()

    // Find the first JSX element child (skip whitespace/text).
    const childElement = children.find(
      (child) =>
        child.getKind() === SyntaxKind.JsxElement ||
        child.getKind() === SyntaxKind.JsxSelfClosingElement
    )

    if (!childElement) {
      // No child element found, just remove asChild.
      asChildAttr.remove()
      continue
    }

    // Get child element info.
    let childTagName: string
    let childProps: string
    let childChildren: string

    if (childElement.getKind() === SyntaxKind.JsxSelfClosingElement) {
      const selfClosing = childElement.asKindOrThrow(
        SyntaxKind.JsxSelfClosingElement
      )
      childTagName = selfClosing.getTagNameNode().getText()
      childProps = selfClosing
        .getAttributes()
        .map((attr) => attr.getText())
        .join(" ")
      childChildren = ""
    } else {
      const jsxChild = childElement.asKindOrThrow(SyntaxKind.JsxElement)
      const openingEl = jsxChild.getOpeningElement()
      childTagName = openingEl.getTagNameNode().getText()
      childProps = openingEl
        .getAttributes()
        .map((attr) => attr.getText())
        .join(" ")
      // Get the children's text content.
      childChildren = jsxChild
        .getJsxChildren()
        .map((c) => c.getText())
        .join("")
    }

    // Determine if we need nativeButton={false}.
    // Add it when the child element is a non-button element.
    const needsNativeButton =
      ELEMENTS_REQUIRING_NATIVE_BUTTON_FALSE.includes(childTagName)

    transformations.push({
      parentElement: jsxElement,
      parentTagName,
      childTagName,
      childProps,
      childChildren,
      needsNativeButton,
    })
  }

  // Apply transformations in reverse order to preserve node validity.
  for (const info of transformations.reverse()) {
    const openingElement = info.parentElement.getOpeningElement()
    const closingElement = info.parentElement.getClosingElement()

    // Get existing attributes (excluding asChild).
    const existingAttrs = openingElement
      .getAttributes()
      .filter((attr) => {
        if (attr.getKind() === SyntaxKind.JsxAttribute) {
          const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
          return jsxAttr.getNameNode().getText() !== "asChild"
        }
        return true
      })
      .map((attr) => attr.getText())
      .join(" ")

    // Build the render prop value.
    const renderValue = info.childProps
      ? `{<${info.childTagName} ${info.childProps} />}`
      : `{<${info.childTagName} />}`

    // Build new attributes.
    let newAttrs = existingAttrs ? `${existingAttrs} ` : ""
    newAttrs += `render=${renderValue}`
    if (info.needsNativeButton) {
      newAttrs += ` nativeButton={false}`
    }

    // Build the new element text.
    const newChildren = info.childChildren.trim() ? `${info.childChildren}` : ""

    const newElementText = `<${info.parentTagName} ${newAttrs}>${newChildren}</${info.parentTagName}>`

    info.parentElement.replaceWithText(newElementText)
  }

  return sourceFile
}
