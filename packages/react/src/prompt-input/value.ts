import {
  $createLineBreakNode,
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $isElementNode,
  type LexicalNode,
} from "lexical"

import { $createTokenNode, TokenNode } from "./token-node"
import type { PromptInputValue } from "./types"
import { getTokens } from "./utils"

export function $readValue(): PromptInputValue {
  const value: PromptInputValue = { text: "", tokens: [] }
  function visit(node: LexicalNode) {
    if ($isElementNode(node)) {
      node.getChildren().forEach(visit)
    } else {
      const start = value.text.length
      value.text += node.getTextContent()
      if (node instanceof TokenNode) {
        value.tokens.push({
          ...node.getSuggestion(),
          start,
          end: value.text.length,
        })
      }
    }
  }
  $getRoot()
    .getChildren()
    .forEach((node, index) => {
      if (index > 0) value.text += "\n"
      visit(node)
    })
  return value
}

export function $writeValue(value: PromptInputValue) {
  const paragraph = $createParagraphNode()
  function appendText(text: string) {
    text.split("\n").forEach((line, index) => {
      if (index > 0) paragraph.append($createLineBreakNode())
      if (line) paragraph.append($createTextNode(line))
    })
  }
  let start = 0
  for (const token of getTokens(value)) {
    appendText(value.text.slice(start, token.start))
    const { start: _start, end: _end, ...suggestion } = token
    paragraph.append($createTokenNode(suggestion))
    start = token.end
  }
  appendText(value.text.slice(start))
  $getRoot().clear().append(paragraph)
}
