"use client"

import { FileCodeIcon } from "lucide-react"

import { useHighlightedCode } from "@/registry/bases/base/hooks/use-highlighted-code"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/base-rhea/ui/code-block"

const code = `import { streamText } from "ai"

export async function POST(request: Request) {
  const { messages } = await request.json()
  const result = streamText({ model: "anthropic/claude-sonnet-4.5", messages })

  return result.toUIMessageStreamResponse()
}`

export function CodeBlockTypeset() {
  const lines = useHighlightedCode(code, "ts")

  return (
    <div className="typeset w-full max-w-md">
      <h3>Stream a response</h3>
      <p>
        Create a route handler that calls <code>streamText</code> and returns
        the stream to the client.
      </p>
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>
            <FileCodeIcon />
            app/api/chat/route.ts
          </CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent lineNumbers>
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
      </CodeBlock>
      <p>
        The <code>useChat</code> hook reads the stream on the client and renders
        the answer while it is written.
      </p>
    </div>
  )
}
