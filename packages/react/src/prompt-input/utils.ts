import type { PromptInputValue } from "./types"

// Ignore stale or overlapping metadata instead of replacing unrelated text.
export function getTokens(value: PromptInputValue) {
  let end = 0
  return value.tokens
    .slice()
    .sort((a, b) => a.start - b.start)
    .filter((token) => {
      if (
        !Number.isInteger(token.start) ||
        !Number.isInteger(token.end) ||
        token.start < end ||
        token.end <= token.start ||
        token.end > value.text.length ||
        value.text.slice(token.start, token.end) !== token.trigger + token.label
      ) {
        return false
      }
      end = token.end
      return true
    })
}
