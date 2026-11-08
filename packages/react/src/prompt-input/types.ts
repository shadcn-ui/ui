export type PromptInputSuggestion = {
  type: string
  id: string
  trigger: string
  label: string
}

export type PromptInputToken = PromptInputSuggestion & {
  /** UTF-16 offsets into the plain text, with an exclusive end. */
  start: number
  end: number
}

export type PromptInputValue = {
  text: string
  tokens: PromptInputToken[]
}
