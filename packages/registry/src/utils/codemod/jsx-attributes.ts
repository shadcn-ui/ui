import { types as t } from "@babel/core"

import { applyManipulation } from "./edits"
import { getReplacementText } from "./indentation"
import { parseTransformInput } from "./parse"
import { getNonWhitespaceStart } from "./trivia"

export interface JsxAttribute {
  attribute: t.JSXAttribute
  // The opening or self-closing element the attribute is on.
  element: t.JSXOpeningElement
}

// ts-morph's getDescendantsOfKind(SyntaxKind.JsxAttribute) on the file: the
// attributes in source order, without spread attributes.
export function getJsxAttributes(file: t.File) {
  const attributes: JsxAttribute[] = []
  t.traverseFast(file, (node) => {
    if (node.type === "JSXOpeningElement") {
      for (const attribute of node.attributes) {
        if (attribute.type === "JSXAttribute") {
          attributes.push({ attribute, element: node })
        }
      }
    }
  })
  return attributes.sort((a, b) => a.attribute.start! - b.attribute.start!)
}

// ts-morph's JsxAttribute#remove() on the attributes at indexes in
// getJsxAttributes(), one after the other. Each removal parses the code again,
// where the index of a later attribute has moved by one.
export function removeJsxAttributes(code: string, indexes: number[]) {
  indexes.forEach((index, removed) => {
    const file = parseTransformInput(code)!
    code = removeJsxAttribute(code, getJsxAttributes(file)[index - removed])
  })
  return code
}

// ts-morph's JsxAttribute#remove(): from the attribute's
// getNonWhitespaceStart(), and the spaces, tabs and line breaks before that,
// to its end. A comment between it and the attribute before it goes too,
// unless the comment ends that attribute's line.
function removeJsxAttribute(
  code: string,
  { attribute, element }: JsxAttribute
) {
  const previous = element.attributes[element.attributes.indexOf(attribute) - 1]
  // The first attribute starts its parent, TypeScript's JsxAttributes, so its
  // getNonWhitespaceStart() is its start.
  let start = previous
    ? getNonWhitespaceStart(
        code,
        { pos: previous.end!, start: attribute.start! },
        { end: previous.end!, isComment: false }
      )
    : attribute.start!
  while (start > 0 && " \t\r\n".includes(code[start - 1])) {
    start--
  }

  return applyManipulation(code, [{ start, end: attribute.end!, text: "" }])
}

// ts-morph's JsxAttribute#setInitializer(text) on an attribute that has an
// initializer: the text is indented for the attribute, then replaces the
// initializer like Node#replaceWithText.
export function setJsxAttributeInitializer(
  code: string,
  attribute: t.JSXAttribute,
  text: string
) {
  const initializer = attribute.value!
  const attributeText = getReplacementText(code, attribute.start!, text)
  return applyManipulation(code, [
    {
      start: initializer.start!,
      end: initializer.end!,
      text: getReplacementText(code, initializer.start!, attributeText),
    },
  ])
}
