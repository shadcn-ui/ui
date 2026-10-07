import { replaceWithText } from "@/src/codemod/edits"
import { removeJsxAttribute } from "@/src/codemod/jsx-attributes"
import {
  findNodeAt,
  getDescendants,
  getText,
  parseTransformInput,
} from "@/src/codemod/parse"
import { isLineBreak, isWhiteSpaceSingleLine } from "@/src/codemod/trivia"
import { type Transformer } from "@/src/transformers"
import { types as t } from "@babel/core"

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

// Process asChild elements iteratively, starting from leaf-level elements.
// Each iteration transforms only elements with no asChild descendants,
// ensuring inner transforms complete before outer ones read the tree.
const MAX_ITERATIONS = 10

export const transformAsChild: Transformer = (code, { config }) => {
  if (!config.style?.startsWith("base-")) {
    return code
  }

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const transformed = transformLeafElements(code)
    if (transformed === undefined) {
      break
    }
    code = transformed
  }

  return code
}

// One iteration: the elements with asChild and no asChild descendants, or
// undefined when no element has asChild. ts-morph removes asChild from those
// without a child element as it finds them, then replaces the others from the
// last, so its nodes stay valid. Leaf elements never contain each other, so
// an edit only moves the elements after it.
function transformLeafElements(code: string) {
  const file = parseTransformInput(code)
  if (!file) {
    return undefined
  }

  const asChildElements = getDescendants(file, isJsxElement).filter(hasAsChild)
  if (asChildElements.length === 0) {
    return undefined
  }

  const leafElements = asChildElements.filter(
    (element) => !getDescendants(element, isJsxElement).some(hasAsChild)
  )
  const withoutChild = leafElements.filter(
    (element) => !getChildElement(element)
  )
  const withChild = leafElements.filter((element) => getChildElement(element))

  const edits = [
    ...withoutChild.map((element) => ({
      start: element.start!,
      edit: removeAsChild,
    })),
    ...withChild.reverse().map((element) => ({
      start: element.start!,
      edit: replaceAsChild,
    })),
  ]

  const applied: { start: number; delta: number }[] = []
  for (const { start, edit } of edits) {
    const position = applied
      .filter((done) => done.start < start)
      .reduce((pos, done) => pos + done.delta, start)
    const element = findNodeAt(code, position, isJsxElement, {})!
    const edited = edit(code, element)
    applied.push({ start, delta: edited.length - code.length })
    code = edited
  }

  return code
}

// ts-morph's JsxElement: an element with a closing tag.
function isJsxElement(node: t.Node): node is t.JSXElement {
  return node.type === "JSXElement" && !node.openingElement.selfClosing
}

// ts-morph's JsxOpeningElement#getAttribute("asChild").
function getAsChild(element: t.JSXElement) {
  return element.openingElement.attributes.find(isAsChild)
}

function hasAsChild(element: t.JSXElement) {
  return getAsChild(element) !== undefined
}

function isAsChild(
  attribute: t.JSXAttribute | t.JSXSpreadAttribute
): attribute is t.JSXAttribute {
  return (
    attribute.type === "JSXAttribute" &&
    attribute.name.type === "JSXIdentifier" &&
    attribute.name.name === "asChild"
  )
}

// The first child that is an element, with or without a closing tag.
function getChildElement(element: t.JSXElement) {
  return element.children.find(
    (child): child is t.JSXElement => child.type === "JSXElement"
  )
}

// No child element: asChild goes, with the whitespace before it.
function removeAsChild(code: string, element: t.JSXElement) {
  return removeJsxAttribute(code, {
    attribute: getAsChild(element)!,
    element: element.openingElement,
  })
}

// <Parent asChild><Child props>children</Child></Parent> becomes
// <Parent render={<Child props />}>children</Parent>.
function replaceAsChild(code: string, element: t.JSXElement) {
  const child = getChildElement(element)!
  const parentTagName = getText(code, element.openingElement.name)
  const childTagName = getText(code, child.openingElement.name)
  const childProps = getAttributesText(code, child.openingElement.attributes)
  const childChildren = child.children
    .map((node) => getJsxChildText(code, node))
    .join("")

  const needsNativeButton =
    parentTagName === "Button" &&
    ELEMENTS_REQUIRING_NATIVE_BUTTON_FALSE.includes(childTagName)

  const existingAttrs = getAttributesText(
    code,
    element.openingElement.attributes.filter(
      (attribute) => !isAsChild(attribute)
    )
  )

  const renderValue = childProps
    ? `{<${childTagName} ${childProps} />}`
    : `{<${childTagName} />}`

  let newAttrs = existingAttrs ? `${existingAttrs} ` : ""
  newAttrs += `render=${renderValue}`
  if (needsNativeButton) {
    newAttrs += ` nativeButton={false}`
  }

  const newChildren = childChildren.trim() ? childChildren : ""

  return replaceWithText(
    code,
    element,
    `<${parentTagName} ${newAttrs}>${newChildren}</${parentTagName}>`,
    {}
  )
}

function getAttributesText(
  code: string,
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
) {
  return attributes.map((attribute) => getText(code, attribute)).join(" ")
}

// ts-morph's getText() of a JSX child. TypeScript starts JSX text past its
// leading whitespace and line breaks, though not past a comment.
function getJsxChildText(
  code: string,
  child: t.JSXElement["children"][number]
) {
  let start = child.start!
  if (child.type === "JSXText") {
    while (
      start < child.end! &&
      (isWhiteSpaceSingleLine(code[start]) || isLineBreak(code[start]))
    ) {
      start++
    }
  }

  return code.slice(start, child.end!)
}
