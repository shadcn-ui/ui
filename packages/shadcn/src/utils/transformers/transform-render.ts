import { Transformer } from "@/src/utils/transformers"
import { SyntaxKind } from "ts-morph"

interface TransformInfo {
  elementStart: number
  elementEnd: number
  newText: string
}

export const transformRender: Transformer = async ({ sourceFile, config }) => {
  // Only run for base- styles.
  if (!config.style?.startsWith("base-")) {
    return sourceFile
  }

  // Collect all transformations first, then apply them in reverse order.
  // This prevents issues with invalidated nodes when modifying the tree.
  const transformations: TransformInfo[] = []

  // Find all JSX elements with render attribute.
  const jsxElements = sourceFile.getDescendantsOfKind(SyntaxKind.JsxElement)

  for (const jsxElement of jsxElements) {
    const openingElement = jsxElement.getOpeningElement()
    const renderAttr = openingElement.getAttribute("render")

    if (!renderAttr) {
      continue
    }

    // Get the children of the parent element.
    const children = jsxElement.getJsxChildren()
    const childrenText = children
      .map((c) => c.getText())
      .join("")
      .trim()

    // If there are no children, nothing to transform.
    if (!childrenText) {
      continue
    }

    // Get the render attribute value.
    if (renderAttr.getKind() !== SyntaxKind.JsxAttribute) {
      continue
    }

    const jsxAttr = renderAttr.asKindOrThrow(SyntaxKind.JsxAttribute)
    const initializer = jsxAttr.getInitializer()

    if (!initializer) {
      continue
    }

    // The render value should be a JSX expression like {<Button />}.
    if (initializer.getKind() !== SyntaxKind.JsxExpression) {
      continue
    }

    const jsxExpression = initializer.asKindOrThrow(SyntaxKind.JsxExpression)
    const expression = jsxExpression.getExpression()

    if (!expression) {
      continue
    }

    // Check if the expression is a self-closing JSX element.
    if (expression.getKind() !== SyntaxKind.JsxSelfClosingElement) {
      // If it's already a full JSX element with children, skip it.
      continue
    }

    const selfClosingElement = expression.asKindOrThrow(
      SyntaxKind.JsxSelfClosingElement
    )
    const tagName = selfClosingElement.getTagNameNode().getText()
    const attributes = selfClosingElement
      .getAttributes()
      .map((attr) => attr.getText())
      .join(" ")

    // Build new render prop value with children moved inside.
    const newRenderValue = attributes
      ? `{<${tagName} ${attributes}>${childrenText}</${tagName}>}`
      : `{<${tagName}>${childrenText}</${tagName}>}`

    // Get the parent tag name and other attributes.
    const parentTagName = openingElement.getTagNameNode().getText()
    const otherAttrs = openingElement
      .getAttributes()
      .filter((attr) => {
        if (attr.getKind() === SyntaxKind.JsxAttribute) {
          const attrName = attr
            .asKindOrThrow(SyntaxKind.JsxAttribute)
            .getNameNode()
            .getText()
          return attrName !== "render"
        }
        return true
      })
      .map((attr) => attr.getText())
      .join(" ")

    // Build new element text as self-closing since children are now in render.
    const newAttrs = otherAttrs
      ? `${otherAttrs} render=${newRenderValue}`
      : `render=${newRenderValue}`

    const newElementText = `<${parentTagName} ${newAttrs} />`

    transformations.push({
      elementStart: jsxElement.getStart(),
      elementEnd: jsxElement.getEnd(),
      newText: newElementText,
    })
  }

  // Apply transformations in reverse order to preserve positions.
  for (const info of transformations.reverse()) {
    const fullText = sourceFile.getFullText()
    const newFullText =
      fullText.substring(0, info.elementStart) +
      info.newText +
      fullText.substring(info.elementEnd)
    sourceFile.replaceWithText(newFullText)
  }

  return sourceFile
}
