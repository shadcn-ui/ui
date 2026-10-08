import { types as t } from "@babel/core"
import CodeBlockWriter from "code-block-writer"

import {
  getListChildren,
  insertIntoCommaSeparatedNodes,
  isItem,
  removeCommaSeparatedChild,
  verifyIndex,
  verifyRemoval,
  type CommaSeparatedList,
  type ListChild,
} from "./comma-lists"
import { getNodesWithComments } from "./comment-nodes"
import { getIndentationLevel } from "./indentation"
import { findNodeAt, getText, type ParseOptions } from "./parse"
import { getJsDocStart, skipTrivia } from "./trivia"

type ObjectMember = t.ObjectExpression["properties"][number]

// An object literal as ts-morph sees it: the SyntaxList of its members, with
// the comment nodes merged in, and getPropertiesWithComments(), the members
// with the comment nodes in CommentNodeParser order.
function getObjectLiteral(code: string, object: t.ObjectExpression) {
  const pos = object.start! + 1
  const closeStart = object.end! - 1
  // TypeScript attaches a JSDoc comment before a member to it.
  const children = getListChildren(
    code,
    pos,
    closeStart,
    object.properties,
    (member, memberPos) =>
      getJsDocStart(code, memberPos, member.end!, {
        includeTrailingComments: false,
      }) ?? member.start!
  )
  const items = children.filter(isItem)

  const membersWithComments = getNodesWithComments(
    code,
    pos,
    object.properties.map((node, index) => ({ pos: items[index].pos, node }))
  ).map(({ start, end, node }): ListChild => {
    if (node) {
      return items[object.properties.indexOf(node)]
    }
    return { kind: "comment", pos: start, start, startWithJsDoc: start, end }
  })
  mergeInComments(
    children,
    membersWithComments.filter((member) => member.kind === "comment")
  )

  const list: CommaSeparatedList = {
    nodeStart: object.start!,
    pos,
    closeStart,
    children,
  }
  return { list, items, membersWithComments }
}

// ts-morph's mergeInComments: each comment node goes before the first child
// that does not end before it.
function mergeInComments(children: ListChild[], comments: ListChild[]) {
  let index = 0
  for (const comment of comments) {
    while (index < children.length && children[index].end < comment.end) {
      index++
    }
    children.splice(index, 0, comment)
    index++
  }
}

// ts-morph's getName() of an object literal member, which spreads do not
// have: the key's text, with the brackets of a computed key.
export function getPropertyName(code: string, member: ObjectMember) {
  if (member.type === "SpreadElement") {
    return undefined
  }
  if (!member.computed) {
    return getText(code, member.key)
  }

  // A method's modifiers, like `async` or `get`, come before the bracket.
  let openBracket = member.start!
  while (code[openBracket] !== "[") {
    openBracket = skipTrivia(code, openBracket + 1)
  }
  const closeBracket = skipTrivia(code, member.key.end!)
  return code.slice(openBracket, closeBracket + 1)
}

// ts-morph's ObjectLiteralExpression#getProperty(name).
export function getProperty(
  code: string,
  object: t.ObjectExpression,
  name: string
) {
  return object.properties.find(
    (member): member is t.ObjectProperty | t.ObjectMethod =>
      getPropertyName(code, member) === name
  )
}

// Whether the member is a PropertyAssignment, `key: value`, in TypeScript's
// tree, rather than a shorthand property, a method or a spread.
export function isPropertyAssignment(
  member: ObjectMember
): member is t.ObjectProperty & { shorthand: false } {
  return member.type === "ObjectProperty" && !member.shorthand
}

// ts-morph's ObjectLiteralExpression#insertPropertyAssignment(index,
// { name, initializer }). Like ts-morph, index counts the comment nodes too.
export function insertPropertyAssignment(
  code: string,
  object: t.ObjectExpression,
  index: number,
  name: string,
  initializer: string,
  options: ParseOptions
) {
  return insertMember(
    code,
    object,
    index,
    (writer) => writer.write(`${name}: `).write(initializer),
    options
  )
}

// ts-morph's ObjectLiteralExpression#addPropertyAssignment({ name,
// initializer }): after the last member or comment node.
export function addPropertyAssignment(
  code: string,
  object: t.ObjectExpression,
  name: string,
  initializer: string,
  options: ParseOptions
) {
  const { membersWithComments } = getObjectLiteral(code, object)
  return insertPropertyAssignment(
    code,
    object,
    membersWithComments.length,
    name,
    initializer,
    options
  )
}

// ts-morph's ObjectLiteralExpression#insertSpreadAssignment(index,
// { expression }). Like ts-morph, index counts the comment nodes too.
export function insertSpreadAssignment(
  code: string,
  object: t.ObjectExpression,
  index: number,
  expression: string,
  options: ParseOptions
) {
  return insertMember(
    code,
    object,
    index,
    (writer) => writer.write("...").write(expression),
    options
  )
}

// ts-morph's ObjectLiteralExpression's #insertProperty: the member is written
// at the object's child indentation, with a hanging indent for its other
// lines, and goes on its own line.
function insertMember(
  code: string,
  object: t.ObjectExpression,
  index: number,
  write: (writer: CodeBlockWriter) => void,
  options: ParseOptions
) {
  const { list, membersWithComments } = getObjectLiteral(code, object)
  verifyIndex(index, membersWithComments.length)

  const writer = new CodeBlockWriter()
  writer.setIndentationLevel(
    getIndentationLevel(code, object.start!, options) + 1
  )
  writer.hangingIndent(() => write(writer))

  return insertIntoCommaSeparatedNodes(
    code,
    list,
    membersWithComments,
    index,
    writer.toString(),
    { useNewLines: true },
    options
  )
}

// ts-morph's ObjectLiteralElement#remove().
export function removeProperty(
  code: string,
  object: t.ObjectExpression,
  member: ObjectMember,
  options: ParseOptions
) {
  const { list, items } = getObjectLiteral(code, object)
  const index = object.properties.indexOf(member)
  const result = removeCommaSeparatedChild(code, list, items[index], options)

  verifyRemoval(
    object.properties,
    index,
    findNodeAt(result, object.start!, t.isObjectExpression, options)?.properties
  )
  return result
}
