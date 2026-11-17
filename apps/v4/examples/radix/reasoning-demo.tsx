"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/styles/radix-rhea/ui/bubble"
import { Button } from "@/styles/radix-rhea/ui/button"
import { Message, MessageContent } from "@/styles/radix-rhea/ui/message"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

const chat = createChat()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "The deploy log has three phases. Install takes 38s and next build takes 52s, both normal for this repo.\n\nImage optimization takes 3m 50s. It reruns on every deploy because its cache key includes the commit hash, so the cache never hits.",
      { delayMs: 40 }
    )
    writer.sleep(400)
    writer.text(
      "Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash, and the deploy should take under two minutes."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function ReasoningRow({
  text,
  running,
  defaultOpen,
}: {
  text: string
  running: boolean
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceTitle>{running ? "Thinking" : "Thought for 5s"}</TraceTitle>
    </TraceLine>
  )

  if (text.length === 0) {
    return line
  }

  return (
    <TraceCollapsible open={open ?? running} onOpenChange={setOpen}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent className="whitespace-pre-wrap">
        {text}
      </TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

export function ReasoningDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        if (message.role === "user") {
          return (
            <Message key={message.id} align="end">
              <MessageContent>
                <Bubble align="end" variant="muted">
                  <BubbleContent>{getMessageText(message)}</BubbleContent>
                </Bubble>
              </MessageContent>
            </Message>
          )
        }

        const streaming = busy && message === messages.at(-1)
        const reasoning = message.parts.filter(
          (part) => part.type === "reasoning"
        )
        const text = getMessageText(message)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {reasoning.length > 0 && (
                <Trace>
                  {reasoning.map((part, index) => (
                    <ReasoningRow
                      key={index}
                      text={part.text}
                      running={streaming && part.state === "streaming"}
                      defaultOpen={busy ? undefined : true}
                    />
                  ))}
                </Trace>
              )}
              {text && <p>{text}</p>}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() => {
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
