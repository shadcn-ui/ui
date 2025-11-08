import { TransformerStyle } from "@/src/styles/transform"
import { Node, SyntaxKind, type SourceFile } from "ts-morph"

export const transformPortal: TransformerStyle<SourceFile> = async ({
  sourceFile,
}) => {
  const canvaPortals = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => {
      const tagName = element.getOpeningElement().getTagNameNode().getText()
      return tagName === "CanvaPortal"
    })

  for (const canvaPortal of canvaPortals) {
    const openingElement = canvaPortal.getOpeningElement()

    const elementAttr = openingElement.getAttributes().find((attr) => {
      return (
        Node.isJsxAttribute(attr) && attr.getNameNode().getText() === "element"
      )
    })

    if (!elementAttr || !Node.isJsxAttribute(elementAttr)) {
      continue
    }

    const initializer = elementAttr.getInitializer()
    if (!initializer || !Node.isJsxExpression(initializer)) {
      continue
    }

    const expression = initializer.getExpression()
    if (!expression) {
      continue
    }

    let newTagName: string | null = null
    let newAttributes: string = ""

    if (Node.isJsxSelfClosingElement(expression)) {
      newTagName = expression.getTagNameNode().getText()
      const attrs = expression.getAttributes()
      if (attrs.length > 0) {
        newAttributes = ` ${attrs.map((attr) => attr.getText()).join(" ")}`
      }
    } else if (Node.isJsxElement(expression)) {
      const opening = expression.getOpeningElement()
      newTagName = opening.getTagNameNode().getText()
      const attrs = opening.getAttributes()
      if (attrs.length > 0) {
        newAttributes = ` ${attrs.map((attr) => attr.getText()).join(" ")}`
      }
    }

    if (!newTagName) {
      continue
    }

    const closingElement = canvaPortal.getClosingElement()

    const startPos = openingElement.getEnd()
    const endPos = closingElement?.getStart() ?? canvaPortal.getEnd()
    const children = sourceFile.getFullText().slice(startPos, endPos).trim()

    const replacement = `<${newTagName}${newAttributes}>${children}</${newTagName}>`

    canvaPortal.replaceWithText(replacement)
  }

  const remainingCanvaPortals = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => {
      const tagName = element.getOpeningElement().getTagNameNode().getText()
      return tagName === "CanvaPortal"
    })

  if (remainingCanvaPortals.length === 0) {
    removeCanvaPortalImports(sourceFile)
  }

  return sourceFile
}

function removeCanvaPortalImports(sourceFile: SourceFile): void {
  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    const canvaPortalImport = importDeclaration
      .getNamedImports()
      .find((specifier) => specifier.getName() === "CanvaPortal")

    if (canvaPortalImport) {
      canvaPortalImport.remove()

      if (importDeclaration.getNamedImports().length === 0) {
        importDeclaration.remove()
      }
    }
  }
}
