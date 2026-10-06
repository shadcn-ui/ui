import { type types as t } from "@babel/core"

import { applyManipulation } from "./edits"
import { getIndentationLevel } from "./indentation"
import { type ParseOptions } from "./parse"
import {
  getCommentEnd,
  getNextNonWhitespacePos,
  getTrailingCommentsEnd,
  getTrailingTriviaEnd,
  isLineBreak,
  isWhiteSpaceSingleLine,
  skipTrivia,
} from "./trivia"

// ts-morph indents with four spaces.
const INDENTATION_TEXT = "    "

// A child of the SyntaxList TypeScript keeps a comma-separated list in: an
// item, a comma, or in an object literal, one of ts-morph's comment nodes.
export interface ListChild {
  kind: "item" | "comma" | "comment"
  // Where the leading trivia starts: TypeScript's pos.
  pos: number
  // getStart().
  start: number
  // getStart(true), which includes the JSDoc comment of an item.
  startWithJsDoc: number
  end: number
}

// A comma-separated list in brackets or braces, such as an array literal's
// elements.
export interface CommaSeparatedList {
  // Where the node with the brackets starts, which is what new lines in the
  // list are indented to.
  nodeStart: number
  // After the opening bracket, where the SyntaxList starts.
  pos: number
  // The closing bracket.
  closeStart: number
  children: ListChild[]
}

// The SyntaxList children of a list in brackets: the items and the commas
// after them. A null item is a hole, TypeScript's OmittedExpression, which is
// empty and starts where its trivia does. getStartWithJsDoc gives an item's
// getStart(true) from its pos.
export function getListChildren(
  code: string,
  pos: number,
  closeStart: number,
  items: (t.Node | null)[],
  getStartWithJsDoc: (item: t.Node, pos: number) => number = (item) =>
    item.start!
) {
  const children: ListChild[] = []

  let itemPos = pos
  for (const item of items) {
    const start = item ? item.start! : itemPos
    const end = item ? item.end! : itemPos
    children.push({
      kind: "item",
      pos: itemPos,
      start,
      startWithJsDoc: item ? getStartWithJsDoc(item, itemPos) : start,
      end,
    })

    const commaStart = skipTrivia(code, end)
    if (code[commaStart] !== "," || commaStart >= closeStart) {
      itemPos = end
      continue
    }
    children.push({
      kind: "comma",
      pos: end,
      start: commaStart,
      startWithJsDoc: commaStart,
      end: commaStart + 1,
    })
    itemPos = commaStart + 1
  }

  return children
}

export function isItem(child: ListChild) {
  return child.kind === "item"
}

// ts-morph's insertIntoCommaSeparatedNodes, which inserts text at index in
// currentNodes: the list's items, and in an object literal, the comment nodes
// between them. The text is separated from its neighbors by commas, and by a
// line break and the list's indentation or by a space.
export function insertIntoCommaSeparatedNodes(
  code: string,
  list: CommaSeparatedList,
  currentNodes: ListChild[],
  insertIndex: number,
  text: string,
  {
    useNewLines = false,
    surroundWithSpaces = false,
  }: { useNewLines?: boolean; surroundWithSpaces?: boolean },
  options: ParseOptions = {}
) {
  const previousNode = currentNodes[insertIndex - 1]
  const previousNonCommentNode = currentNodes
    .slice(0, insertIndex)
    .reverse()
    .find(isItem)
  const nextNode = currentNodes[insertIndex]
  const nextNonCommentNode = currentNodes.slice(insertIndex).find(isItem)
  const separator = useNewLines ? "\n" : " "
  let newText = text

  function prependSeparator() {
    if (!startsWithNewLine(newText)) {
      newText = separator + newText
    }
  }

  function appendIndentation() {
    if (useNewLines || newText.endsWith("\n")) {
      const level = getIndentationLevel(code, list.nodeStart, options)
      // ts-morph repeats its indentation text here, which drops the fraction
      // of a level that code-block-writer indents by.
      newText += INDENTATION_TEXT.repeat(nextNode ? level + 1 : level)
    }
  }

  function appendSeparator() {
    if (!newText.endsWith("\n")) {
      newText += separator
    }
    appendIndentation()
  }

  function appendCommaAndSeparator() {
    newText = appendCommaToText(newText)
    appendSeparator()
  }

  // The new text starts with a comma after the previous item, which takes
  // the place of the item's own comma, and keeps the comments that trail the
  // item and that comma.
  function prependCommaAndSeparator() {
    if (!previousNonCommentNode) {
      prependSeparator()
      return
    }

    const nextSibling =
      list.children[list.children.indexOf(previousNonCommentNode) + 1]
    let prefix = ""
    if (nextSibling?.kind === "comma") {
      prefix += getTrailingComments(code, previousNonCommentNode.end)
      prefix += ","
      prefix +=
        previousNonCommentNode === previousNode
          ? getTrailingComments(code, nextSibling.end)
          : getCommentNodeTexts(previousNonCommentNode, previousNode)
    } else {
      prefix += ","
      prefix +=
        previousNonCommentNode === previousNode
          ? getTrailingComments(code, previousNonCommentNode.end)
          : getCommentNodeTexts(previousNonCommentNode, previousNode)
    }
    prependSeparator()
    newText = prefix + newText
  }

  // The text from the previous item through the comment nodes after it, which
  // the insertion replaces. It starts at the item's end, so when the item has
  // a comma, the comma is copied too and the list gets two in a row.
  function getCommentNodeTexts(item: ListChild, lastComment: ListChild) {
    const end = getTrailingCommentsEnd(code, lastComment.end) ?? lastComment.end
    return code.slice(item.end, end)
  }

  if (previousNode) {
    prependCommaAndSeparator()
    if (nextNonCommentNode) {
      appendCommaAndSeparator()
    } else if (useNewLines || surroundWithSpaces) {
      appendSeparator()
    } else {
      appendIndentation()
    }

    const insertPos = (previousNonCommentNode ?? previousNode).end
    const nextEndStart = nextNode ? nextNode.startWithJsDoc : list.closeStart
    return applyManipulation(
      code,
      [{ start: insertPos, end: nextEndStart, text: newText }],
      options
    )
  }

  if (nextNode) {
    if (useNewLines || surroundWithSpaces) {
      prependSeparator()
    }
    if (nextNonCommentNode) {
      appendCommaAndSeparator()
    } else {
      appendSeparator()
    }

    return applyManipulation(
      code,
      [{ start: list.pos, end: nextNode.startWithJsDoc, text: newText }],
      options
    )
  }

  if (useNewLines || surroundWithSpaces) {
    prependSeparator()
    appendSeparator()
  } else {
    appendIndentation()
  }

  return applyManipulation(
    code,
    [{ start: list.pos, end: list.closeStart, text: newText }],
    options
  )
}

// ts-morph's removeCommaSeparatedChild: removes the child with its comma, or
// with the comma before it when it is the last child, and the spaces and
// line breaks around it.
export function removeCommaSeparatedChild(
  code: string,
  list: CommaSeparatedList,
  child: ListChild,
  options: ParseOptions = {}
) {
  const { children } = list
  const index = children.indexOf(child)
  const isRemovingFirstChild = index === 0

  const childrenToRemove = [child]
  if (children[index + 1]?.kind === "comma") {
    childrenToRemove.push(children[index + 1])
  }
  if (
    children.at(-1) === childrenToRemove.at(-1) &&
    children[index - 1]?.kind === "comma"
  ) {
    childrenToRemove.unshift(children[index - 1])
  }

  const firstChild = childrenToRemove[0]
  const removePrecedingSpaces =
    !isRemovingFirstChild ||
    (children.length === childrenToRemove.length &&
      isFirstNodeOnLine(code, list, firstChild))

  let start = getNonWhitespaceStart(code, list, firstChild)
  while (
    start > 0 &&
    isRemovable(code[start - 1], removePrecedingSpaces, !isRemovingFirstChild)
  ) {
    start--
  }

  let end = childrenToRemove[childrenToRemove.length - 1].end
  while (
    end < code.length &&
    isRemovable(code[end], isRemovingFirstChild, isRemovingFirstChild)
  ) {
    end++
  }

  return applyManipulation(code, [{ start, end, text: "" }], options)
}

function isRemovable(char: string, spaces: boolean, newLines: boolean) {
  return (
    (newLines && (char === "\r" || char === "\n")) ||
    (spaces && (char === " " || char === "\t"))
  )
}

// ts-morph's Node#getNonWhitespaceStart() for a list child. The child's
// parent is the node with the brackets, which never starts where the child's
// trivia does.
function getNonWhitespaceStart(
  code: string,
  list: CommaSeparatedList,
  child: ListChild
) {
  const previousSibling = list.children[list.children.indexOf(child) - 1]

  let searchStart = child.pos
  if (previousSibling?.kind === "comment") {
    searchStart = previousSibling.end
  } else if (
    previousSibling &&
    code.slice(child.pos, child.startWithJsDoc).includes("\n")
  ) {
    searchStart = getTrailingTriviaEnd(code, previousSibling.end)
  }

  return getNextNonWhitespacePos(code, searchStart)
}

// ts-morph's Node#isFirstNodeOnLine().
function isFirstNodeOnLine(
  code: string,
  list: CommaSeparatedList,
  child: ListChild
) {
  for (
    let pos = getNonWhitespaceStart(code, list, child) - 1;
    pos >= 0;
    pos--
  ) {
    if (code[pos] !== " " && code[pos] !== "\t") {
      return code[pos] === "\n"
    }
  }

  return true
}

function getTrailingComments(code: string, pos: number) {
  return code.slice(pos, getTrailingCommentsEnd(code, pos) ?? pos)
}

// ts-morph's StringUtils.startsWithNewLine.
function startsWithNewLine(text: string) {
  return text.startsWith("\n") || text.startsWith("\r\n")
}

// ts-morph's appendCommaToText: a comma right after the last token of text,
// so in front of the whitespace and comments that end it, unless that token
// is a comma.
export function appendCommaToText(text: string) {
  const end = getLastTokenEnd(text)
  if (end === 0 || text[end - 1] === ",") {
    return text
  }

  return text.slice(0, end) + "," + text.slice(end)
}

// Where the last token of text ends, as ts-morph finds it with TypeScript's
// scanner, which it does not ask to rescan anything: a string ends at a line
// break, and a template literal's ${} holds tokens of its own. 0 when text
// has no tokens.
function getLastTokenEnd(text: string) {
  // The braces opened in each template literal expression being scanned.
  const openBraces: number[] = []
  let lastTokenEnd = 0

  let pos = 0
  while (pos < text.length) {
    const char = text[pos]
    const commentEnd = getCommentEnd(text, pos)
    if (commentEnd !== undefined) {
      pos = commentEnd
      continue
    }
    if (isWhiteSpaceSingleLine(char) || isLineBreak(char)) {
      pos++
      continue
    }

    if (char === '"' || char === "'") {
      pos = skipString(text, pos)
    } else if (char === "`") {
      pos = skipTemplate(text, pos + 1, openBraces)
    } else if (char === "}" && openBraces.at(-1) === 0) {
      openBraces.pop()
      pos = skipTemplate(text, pos + 1, openBraces)
    } else {
      if (openBraces.length > 0 && (char === "{" || char === "}")) {
        openBraces[openBraces.length - 1] += char === "{" ? 1 : -1
      }
      pos++
    }
    lastTokenEnd = pos
  }

  return lastTokenEnd
}

// Past the string literal at pos, or to the line break it is unterminated at.
function skipString(text: string, pos: number) {
  const quote = text[pos]
  pos++
  while (pos < text.length && text[pos] !== quote) {
    if (isLineBreak(text[pos])) {
      return pos
    }
    // An escaped line break continues the string, \r\n included.
    pos += text[pos] !== "\\" ? 1 : text.startsWith("\r\n", pos + 1) ? 3 : 2
  }

  return Math.min(pos + 1, text.length)
}

// Past a template literal's text from pos: to its closing backtick, or into
// the ${} expression that follows, which opens a level in openBraces.
function skipTemplate(text: string, pos: number, openBraces: number[]) {
  while (pos < text.length) {
    if (text[pos] === "`") {
      return pos + 1
    }
    if (text.startsWith("${", pos)) {
      openBraces.push(0)
      return pos + 2
    }
    pos += text[pos] === "\\" ? 2 : 1
  }

  return pos
}
