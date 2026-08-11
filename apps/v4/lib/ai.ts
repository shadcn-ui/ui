// Compatibility bridge for v4 examples that still import from `@/lib/ai`.
// The public chat API lives in `@shadcn/helpers/ai-sdk`; `getMessageText`
// remains local to the app.
import type { UIMessage } from "ai"

export * from "@shadcn/helpers/ai-sdk"

export function getMessageText(message: Pick<UIMessage, "parts">) {
  return message.parts.reduce(
    (text, part) => (part.type === "text" ? text + part.text : text),
    ""
  )
}
