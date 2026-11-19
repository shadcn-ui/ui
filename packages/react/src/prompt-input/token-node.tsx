import * as React from "react"
import {
  $applyNodeReplacement,
  DecoratorNode,
  type NodeKey,
  type SerializedLexicalNode,
} from "lexical"

import type { PromptInputSuggestion } from "./types"

export const TokenRendererContext = React.createContext<
  (token: PromptInputSuggestion) => React.ReactNode
>((token) => token.trigger + token.label)

function Token({ token }: { token: PromptInputSuggestion }) {
  const renderToken = React.useContext(TokenRendererContext)
  return <>{renderToken(token)}</>
}

type SerializedTokenNode = SerializedLexicalNode & {
  suggestion: PromptInputSuggestion
}

export class TokenNode extends DecoratorNode<React.ReactNode> {
  __suggestion: PromptInputSuggestion

  static getType() {
    return "prompt-input-token"
  }

  static clone(node: TokenNode) {
    return new TokenNode(node.__suggestion, node.__key)
  }

  constructor(suggestion: PromptInputSuggestion, key?: NodeKey) {
    super(key)
    this.__suggestion = suggestion
  }

  getSuggestion() {
    return this.getLatest().__suggestion
  }

  getTextContent() {
    const token = this.getSuggestion()
    return token.trigger + token.label
  }

  createDOM() {
    const element = document.createElement("span")
    element.dataset.slot = "prompt-input-token"
    return element
  }

  updateDOM() {
    return false
  }

  isKeyboardSelectable() {
    return false
  }

  decorate() {
    return <Token token={this.getSuggestion()} />
  }

  exportJSON(): SerializedTokenNode {
    return { ...super.exportJSON(), suggestion: this.getSuggestion() }
  }

  static importJSON(node: SerializedTokenNode) {
    return $createTokenNode(node.suggestion)
  }

  exportDOM() {
    const element = document.createElement("span")
    element.textContent = this.getTextContent()
    return { element }
  }
}

export function $createTokenNode(suggestion: PromptInputSuggestion) {
  return $applyNodeReplacement(new TokenNode(suggestion))
}
