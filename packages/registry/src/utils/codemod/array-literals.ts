import { type types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import {
  getListChildren,
  insertIntoCommaSeparatedNodes,
  isItem,
  removeCommaSeparatedChild,
  type CommaSeparatedList,
} from "./comma-lists"
import { getIndentationLevel } from "./indentation"
import { type ParseOptions } from "./parse"
import { getJsDocStart } from "./trivia"

// An array literal as ts-morph sees it: the SyntaxList of its elements, and
// getElements(), which includes holes.
function getArrayLiteral(code: string, array: t.ArrayExpression) {
  const list: CommaSeparatedList = {
    nodeStart: array.start!,
    pos: array.start! + 1,
    closeStart: array.end! - 1,
    children: getListChildren(
      code,
      array.start! + 1,
      array.end! - 1,
      array.elements,
      (element, pos) => getElementStartWithJsDoc(code, element, pos)
    ),
  }
  return { list, elements: list.children.filter(isItem) }
}

// TypeScript attaches a JSDoc comment before an element to it only for these
// expressions, and for all but a class, also one on the line of the comma
// before them.
function getElementStartWithJsDoc(code: string, element: t.Node, pos: number) {
  switch (element.type) {
    case "ArrowFunctionExpression":
    case "FunctionExpression":
    case "ParenthesizedExpression":
      return (
        getJsDocStart(code, pos, element.end!, {
          includeTrailingComments: true,
        }) ?? element.start!
      )
    case "ClassExpression":
      return (
        getJsDocStart(code, pos, element.end!, {
          includeTrailingComments: false,
        }) ?? element.start!
      )
    default:
      return element.start!
  }
}

// ts-morph's ArrayLiteralExpression#insertElement(index, text). The element
// goes on its own line when every element is on a line of its own, or, with
// fewer than two elements, when the array spans lines.
export function insertElement(
  code: string,
  array: t.ArrayExpression,
  index: number,
  text: string,
  options: ParseOptions = {}
) {
  const { list, elements } = getArrayLiteral(code, array)
  const useNewLines =
    elements.length > 1
      ? elements.every(
          (element, i) =>
            i === 0 || spansLines(code, elements[i - 1].start, element.start)
        )
      : spansLines(code, array.start!, array.end!)

  const writer = new CodeBlockWriter()
  const childIndentationLevel =
    getIndentationLevel(code, array.start!, options) + 1
  if (useNewLines) {
    writer.setIndentationLevel(childIndentationLevel)
  } else {
    writer.queueIndentationLevel(childIndentationLevel)
  }
  writer.write(text)

  return insertIntoCommaSeparatedNodes(
    code,
    list,
    elements,
    index,
    writer.toString(),
    { useNewLines },
    options
  )
}

// ts-morph's ArrayLiteralExpression#addElement(text).
export function addElement(
  code: string,
  array: t.ArrayExpression,
  text: string,
  options: ParseOptions = {}
) {
  return insertElement(code, array, array.elements.length, text, options)
}

// ts-morph's ArrayLiteralExpression#removeElement(index).
export function removeElement(
  code: string,
  array: t.ArrayExpression,
  index: number,
  options: ParseOptions = {}
) {
  const { list, elements } = getArrayLiteral(code, array)
  return removeCommaSeparatedChild(code, list, elements[index], options)
}

// Whether a line break lies between the two positions: ts-morph counts lines
// by "\n".
function spansLines(code: string, start: number, end: number) {
  return code.slice(start, end).includes("\n")
}
