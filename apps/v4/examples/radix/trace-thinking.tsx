"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { BrainIcon } from "lucide-react"

import { createChat } from "@/lib/ai"
import { Button } from "@/styles/radix-rhea/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/radix-rhea/ui/trace"

const chat = createChat()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer.reasoning(
      "The build log shows install and compile finish in under a minute. Image optimization takes almost four, and it reruns on every deploy because the cache key includes the commit hash.",
      { delayMs: 60 }
    )
    writer.sleep(400)
    writer.text(
      "Image optimization is the bottleneck. Key its cache on the lockfile and the image directory instead of the commit hash."
    )
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

function ThinkingTrace({ text, running }: { text: string; running: boolean }) {
  const [open, setOpen] = React.useState<boolean>()

  const line = (
    <TraceLine status={running ? "running" : undefined}>
      <TraceIcon>
        <BrainIcon />
      </TraceIcon>
      <TraceTitle>{running ? "Thinking" : "Thought"}</TraceTitle>
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

function groupParts(parts: UIMessage["parts"]) {
  const runs: { trace: boolean; parts: UIMessage["parts"] }[] = []

  for (const part of parts) {
    const trace = part.type === "reasoning"

    if (!trace && part.type !== "text") {
      continue
    }

    const last = runs.at(-1)

    if (last?.trace === trace) {
      last.parts.push(part)
    } else {
      runs.push({ trace, parts: [part] })
    }
  }

  return runs
}

export function TraceThinking() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const live = status === "streaming" && message === messages.at(-1)

        return groupParts(message.parts).map((run, runIndex) =>
          run.trace ? (
            <Trace key={`${message.id}-${runIndex}`}>
              {run.parts.map((part, index) =>
                part.type === "reasoning" ? (
                  <ThinkingTrace
                    key={index}
                    text={part.text}
                    running={live && part.state === "streaming"}
                  />
                ) : null
              )}
            </Trace>
          ) : (
            run.parts.map((part, index) =>
              part.type === "text" ? (
                <p
                  key={`${message.id}-${runIndex}-${index}`}
                  className={
                    message.role === "user" ? "font-medium" : undefined
                  }
                >
                  {part.text}
                </p>
              ) : null
            )
          )
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        disabled={busy}
        onClick={() =>
          nextMessage ? sendMessage(nextMessage) : setMessages(initialMessages)
        }
      >
        {nextMessage ? "Send message" : "Reset"}
      </Button>
    </div>
  )
}
