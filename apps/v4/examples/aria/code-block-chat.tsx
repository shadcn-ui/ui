"use client"

import { useHighlightedCode } from "@/registry/bases/aria/hooks/use-highlighted-code"
import { Bubble, BubbleContent } from "@/styles/aria-rhea/ui/bubble"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/aria-rhea/ui/code-block"
import { Message, MessageContent } from "@/styles/aria-rhea/ui/message"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.5",
    messages,
  })

  return result.toUIMessageStreamResponse()
}`

export function CodeBlockChat() {
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Message align="end">
        <MessageContent>
          <Bubble variant="muted">
            <BubbleContent>How do I stream a response?</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
      <Message>
        <MessageContent className="gap-3">
          <p>Create a route handler that returns the stream:</p>
          <CodeBlock>
            <CodeBlockHeader>
              <CodeBlockTitle>app/api/chat/route.ts</CodeBlockTitle>
              <CodeBlockActions>
                <CodeBlockCopyButton value={code} />
              </CodeBlockActions>
            </CodeBlockHeader>
            <CodeBlockContent>
              {lines.map((line, index) => (
                <CodeBlockLine key={index}>{line}</CodeBlockLine>
              ))}
            </CodeBlockContent>
          </CodeBlock>
          <p>The client reads it with useChat.</p>
        </MessageContent>
      </Message>
    </div>
  )
}
