"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import {
  Streamdown,
  useIsCodeFenceIncomplete,
  type ExtraProps,
} from "streamdown"

import { createChat, getMessageText } from "@/lib/ai"
import { useHighlightedCode } from "@/registry/bases/aria/hooks/use-highlighted-code"
import { Bubble, BubbleContent } from "@/styles/aria-rhea/ui/bubble"
import { Button } from "@/styles/aria-rhea/ui/button"
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

const response = `Wrap the value in a \`useDebounce\` hook. It returns the latest value once it stops changing for \`delay\` milliseconds.

\`\`\`tsx
export function useDebounce<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = React.useState(value)

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timeout)
  }, [value, delay])

  return debounced
}
\`\`\`

Pass the debounced value to your fetch instead of the raw input.`

const chat = createChat()
  .user("How do I debounce a search input in React?")
  .assistant(({ writer }) => {
    writer.text(response)
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 30 })

function MarkdownCodeBlock({
  code,
  language,
}: {
  code: string
  language: string
}) {
  // True while the closing fence has not arrived yet.
  const incomplete = useIsCodeFenceIncomplete()
  const lines = useHighlightedCode(code, language)

  return (
    <CodeBlock>
      <CodeBlockHeader>
        <CodeBlockTitle>{language || "text"}</CodeBlockTitle>
        <CodeBlockActions>
          <CodeBlockCopyButton value={code} isDisabled={incomplete} />
        </CodeBlockActions>
      </CodeBlockHeader>
      <CodeBlockContent>
        {lines.map((line, index) => (
          <CodeBlockLine key={index}>{line}</CodeBlockLine>
        ))}
      </CodeBlockContent>
    </CodeBlock>
  )
}

function MarkdownCode({
  node,
  className,
  children,
  ...props
}: React.ComponentProps<"code"> & ExtraProps) {
  // Streamdown marks fenced code with data-block. Everything else is inline.
  if (!("data-block" in props)) {
    return (
      <code
        className="rounded-sm bg-muted px-1 py-0.5 font-mono text-[0.9em]"
        {...props}
      >
        {children}
      </code>
    )
  }

  return (
    <MarkdownCodeBlock
      code={typeof children === "string" ? children : ""}
      language={/language-(\S+)/.exec(className ?? "")?.[1] ?? ""}
    />
  )
}

const components = { code: MarkdownCode }

export function CodeBlockMarkdown() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-112 w-full max-w-md flex-col gap-4 py-6 text-sm">
      {messages.map((message) =>
        message.role === "user" ? (
          <Message key={message.id} align="end">
            <MessageContent>
              <Bubble align="end" variant="muted">
                <BubbleContent>{getMessageText(message)}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
        ) : (
          <Message key={message.id}>
            <MessageContent>
              <Streamdown
                controls={false}
                components={components}
                isAnimating={busy && message === messages.at(-1)}
              >
                {getMessageText(message)}
              </Streamdown>
            </MessageContent>
          </Message>
        )
      )}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onPress={() => {
            setMessages([])
            sendMessage(question)
          }}
        >
          Replay
        </Button>
      )}
    </div>
  )
}
