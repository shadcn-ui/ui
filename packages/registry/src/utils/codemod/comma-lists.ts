import { types as t } from "@babel/core"

import { applyManipulation, SyntaxErrorInsertedError } from "./edits"
import { getIndentationText } from "./indentation"
import { type ParseOptions } from "./parse"
import {
  getCommentEnd,
  getNonWhitespaceStart,
  getTrailingCommentsEnd,
  isLineBreak,
  isWhiteSpaceSingleLine,
  skipTrivia,
} from "./trivia"

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
  // Where the last child ends, and the next one's trivia starts.
  let end = pos

  // Adds the commas from end on: an item's own, and in an object literal,
  // those TypeScript skips (see parseModule), which are children of the list
  // too. In an array literal, Babel has a hole between two commas, so only
  // one comma comes before a hole.
  function addCommas(beforeHole: boolean) {
    for (
      let start = skipTrivia(code, end);
      code[start] === "," && start < closeStart;
      start = skipTrivia(code, end)
    ) {
      children.push({
        kind: "comma",
        pos: end,
        start,
        startWithJsDoc: start,
        end: start + 1,
      })
      end = start + 1
      if (beforeHole) {
        return
      }
    }
  }

  if (items[0] !== null) {
    addCommas(false)
  }
  items.forEach((item, index) => {
    const start = item ? item.start! : end
    children.push({
      kind: "item",
      pos: end,
      start,
      startWithJsDoc: item ? getStartWithJsDoc(item, end) : start,
      end: item ? item.end! : end,
    })
    end = item ? item.end! : end
    addCommas(items[index + 1] === null)
  })

  return children
}

export function isItem(child: ListChild) {
  return child.kind === "item"
}

// ts-morph's verifyAndGetIndex for the indexes the editors pass, which are
// never negative: an insertion at an index past the length nodes throws.
export function verifyIndex(index: number, length: number) {
  if (index > length) {
    throw new Error(
      `Invalid index: The max index is ${length}, but ${index} was specified.`
    )
  }
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
  options: ParseOptions
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
      newText += getIndentationText(
        code,
        list.nodeStart,
        options,
        nextNode ? 1 : 0
      )
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
  options: ParseOptions
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

  let start = getChildNonWhitespaceStart(code, list, firstChild)
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

// An array element, a hole, or an object member.
type Member = t.Node | null

// ts-morph's node handler for a removal, which rejects the edit unless it
// took out the member at index and left the others as they were. Removing a
// member can take a hole next to it with it, or pull the rest of its line
// onto a line comment before it.
export function verifyRemoval(
  members: Member[],
  index: number,
  editedMembers: Member[] | undefined
) {
  const expected = getMemberKinds(members).filter((_, i) => i !== index)
  const actual = editedMembers ? getMemberKinds(editedMembers) : []
  if (
    actual.length !== expected.length ||
    actual.some((kind, i) => kind !== expected[i])
  ) {
    throw new SyntaxErrorInsertedError()
  }
}

// The kind of each member as TypeScript tells them apart: a shorthand
// property is not a property assignment, and a hole is a member too.
function getMemberKinds(members: Member[]) {
  return members.map((member) =>
    member === null
      ? "Hole"
      : t.isObjectProperty(member) && member.shorthand
        ? "ShorthandProperty"
        : member.type
  )
}

function isRemovable(char: string, spaces: boolean, newLines: boolean) {
  return (
    (newLines && (char === "\r" || char === "\n")) ||
    (spaces && (char === " " || char === "\t"))
  )
}

// ts-morph's Node#getNonWhitespaceStart() for a list child, whose parent is
// the node with the brackets.
function getChildNonWhitespaceStart(
  code: string,
  list: CommaSeparatedList,
  child: ListChild
) {
  const previousSibling = list.children[list.children.indexOf(child) - 1]
  return getNonWhitespaceStart(
    code,
    { pos: child.pos, start: child.startWithJsDoc },
    previousSibling && {
      end: previousSibling.end,
      isComment: previousSibling.kind === "comment",
    }
  )
}

// ts-morph's Node#isFirstNodeOnLine().
function isFirstNodeOnLine(
  code: string,
  list: CommaSeparatedList,
  child: ListChild
) {
  for (
    let pos = getChildNonWhitespaceStart(code, list, child) - 1;
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
