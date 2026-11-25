"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { useHighlightedCode } from "@/registry/bases/base/hooks/use-highlighted-code"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  CodeBlock,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockFooter,
  CodeBlockHeader,
  CodeBlockLine,
  CodeBlockTitle,
} from "@/styles/base-rhea/ui/code-block"

const code = `"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Chat() {
  const [input, setInput] = React.useState("")
  const { messages, sendMessage, status } = useChat()

  return (
    <div className="flex flex-col gap-4">
      {messages.map((message) => (
        <div key={message.id}>
          {message.parts.map((part, index) =>
            part.type === "text" ? <p key={index}>{part.text}</p> : null
          )}
        </div>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          sendMessage({ text: input })
          setInput("")
        }}
      >
        <Input value={input} onChange={(event) => setInput(event.target.value)} />
        <Button disabled={status !== "ready"}>Send</Button>
      </form>
    </div>
  )
}`

export function CodeBlockShowMoreScroll() {
  const [expanded, setExpanded] = React.useState(false)
  const lines = useHighlightedCode(code, "tsx")
  const id = React.useId()

  return (
    <div className="w-full max-w-md">
      <CodeBlock>
        <CodeBlockHeader>
          <CodeBlockTitle>components/chat.tsx</CodeBlockTitle>
          <CodeBlockActions>
            <CodeBlockCopyButton value={code} />
          </CodeBlockActions>
        </CodeBlockHeader>
        <CodeBlockContent
          id={id}
          lineNumbers
          className={
            expanded
              ? "max-h-96 scroll-fade-y"
              : "max-h-64 scroll-fade-y overflow-y-hidden"
          }
        >
          {lines.map((line, index) => (
            <CodeBlockLine key={index}>{line}</CodeBlockLine>
          ))}
        </CodeBlockContent>
        <CodeBlockFooter className="justify-center">
          <Button
            variant="ghost"
            size="xs"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronDownIcon className="transition-transform in-aria-expanded:rotate-180" />
            {expanded ? "Show less" : "Show more"}
          </Button>
        </CodeBlockFooter>
      </CodeBlock>
    </div>
  )
}
