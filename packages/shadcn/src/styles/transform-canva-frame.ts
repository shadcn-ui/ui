import { TransformerStyle } from "@/src/styles/transform"
import { Node, SyntaxKind, type SourceFile } from "ts-morph"

export const transformCanvaFrame: TransformerStyle<SourceFile> = async ({
  sourceFile,
}) => {
  const canvaFrames = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => {
      const tagName = element.getOpeningElement().getTagNameNode().getText()
      return tagName === "CanvaFrame"
    })

  for (const canvaFrame of canvaFrames) {
    const openingElement = canvaFrame.getOpeningElement()
    const closingElement = canvaFrame.getClosingElement()

    const attributes = openingElement.getAttributes()
    const otherAttrs: string[] = []

    for (const attr of attributes) {
      if (Node.isJsxAttribute(attr)) {
        const name = attr.getNameNode().getText()
        if (name !== "className") {
          otherAttrs.push(attr.getText())
        }
      } else if (Node.isJsxSpreadAttribute(attr)) {
        otherAttrs.push(attr.getText())
      }
    }

    const startPos = openingElement.getEnd()
    const endPos = closingElement?.getStart() ?? canvaFrame.getEnd()
    const children = sourceFile.getFullText().slice(startPos, endPos).trim()

    const newClassName =
      "bg-background border flex overflow-hidden rounded-xl p-8"
    const otherAttrsText =
      otherAttrs.length > 0 ? ` ${otherAttrs.join(" ")}` : ""
    const replacement = `<div className="${newClassName}"${otherAttrsText}>${children}</div>`

    canvaFrame.replaceWithText(replacement)
  }

  const remainingCanvaFrames = sourceFile
    .getDescendantsOfKind(SyntaxKind.JsxElement)
    .filter((element) => {
      const tagName = element.getOpeningElement().getTagNameNode().getText()
      return tagName === "CanvaFrame"
    })

  if (remainingCanvaFrames.length === 0) {
    removeCanvaFrameImports(sourceFile)
  }

  return sourceFile
}

function removeCanvaFrameImports(sourceFile: SourceFile): void {
  for (const importDeclaration of sourceFile.getImportDeclarations()) {
    const canvaFrameImport = importDeclaration
      .getNamedImports()
      .find((specifier) => specifier.getName() === "CanvaFrame")

    if (canvaFrameImport) {
      canvaFrameImport.remove()

      if (importDeclaration.getNamedImports().length === 0) {
        importDeclaration.remove()
      }
    }
  }
}
