"use client"

import * as React from "react"
import type {
  PromptInputSuggestion,
  PromptInputValue,
} from "@shadcn/react/prompt-input"
import { ArrowUpIcon } from "lucide-react"

import { Badge } from "@/styles/aria-rhea/ui/badge"
import { Bubble, BubbleContent } from "@/styles/aria-rhea/ui/bubble"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/styles/aria-rhea/ui/input-group"
import { Message, MessageContent } from "@/styles/aria-rhea/ui/message"
import {
  PromptInputContent,
  PromptInputEditor,
} from "@/styles/aria-rhea/ui/prompt-input"

const suggestions: PromptInputSuggestion[] = [
  { type: "skill", id: "review", trigger: "/", label: "review" },
  { type: "skill", id: "revert", trigger: "/", label: "revert" },
  { type: "file", id: "readme", trigger: "@", label: "README.md" },
  { type: "file", id: "package", trigger: "@", label: "package.json" },
]

function renderToken(token: PromptInputSuggestion) {
  return (
    <Badge variant="secondary">
      {token.trigger}
      {token.label}
    </Badge>
  )
}

export function PromptInputTokensDemo() {
  const [value, setValue] = React.useState<PromptInputValue>({
    text: "",
    tokens: [],
  })
  const [messages, setMessages] = React.useState<PromptInputValue[]>([])

  function send() {
    if (!value.text.trim()) return
    setMessages((current) => [...current, value])
    setValue({ text: "", tokens: [] })
  }

  return (
    <div className="mx-auto flex w-full max-w-lg flex-col gap-4 py-6">
      {messages.map((message, index) => (
        <Message key={index} align="end">
          <MessageContent>
            <Bubble variant="muted">
              <BubbleContent>
                <PromptInputContent value={message} renderToken={renderToken} />
              </BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
      ))}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          send()
        }}
      >
        <InputGroup>
          <PromptInputEditor
            aria-label="Message"
            placeholder="Type / for skills or @ for files..."
            value={value}
            onValueChange={setValue}
            suggestions={suggestions}
            renderToken={renderToken}
            onSubmit={send}
          />
          <InputGroupAddon align="block-end">
            <InputGroupButton
              type="submit"
              size="icon-sm"
              variant="default"
              className="ml-auto rounded-full"
              isDisabled={!value.text.trim()}
              aria-label="Send"
            >
              <ArrowUpIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>
    </div>
  )
}
