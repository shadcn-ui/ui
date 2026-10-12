"use client"

import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"
import { ArrowUpRightIcon, GlobeIcon } from "lucide-react"

import { createChat } from "@/lib/ai"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/base-rhea/ui/trace"

const chat = createChat()
  .user("How do I start an Astro project with pnpm?")
  .assistant(({ writer }) => {
    writer.text(
      "Run pnpm create astro@latest and follow the prompts. It scaffolds the project and installs the dependencies."
    )
    writer.sourceUrl({
      url: "https://docs.astro.build/en/install-and-setup/",
      title: "Install Astro | docs.astro.build",
    })
    writer.sourceUrl({
      url: "https://www.npmjs.com/package/create-astro",
      title: "create-astro | npmjs.com",
    })
    writer.sourceUrl({
      url: "https://docs.astro.build/en/install-and-setup/",
      title: "Install Astro | docs.astro.build",
    })
    writer.sourceUrl({
      url: "https://pnpm.io/cli/create",
      title: "pnpm create | pnpm.io",
    })
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

type SourcePart = Extract<UIMessage["parts"][number], { type: "source-url" }>

function Sources({ sources }: { sources: SourcePart[] }) {
  return (
    <Trace>
      <TraceCollapsible defaultOpen>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <GlobeIcon />
            </TraceIcon>
            <TraceTitle>Used {sources.length} sources</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
              >
                <TraceLine>
                  <TraceIcon>
                    <GlobeIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {source.title ?? new URL(source.url).hostname}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </TraceTitle>
                  <TraceIcon>
                    <ArrowUpRightIcon />
                  </TraceIcon>
                </TraceLine>
              </a>
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

export function SourcesDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const sources = message.parts
          .filter((part) => part.type === "source-url")
          .filter(
            (part, index, all) =>
              all.findIndex((other) => other.url === part.url) === index
          )
        const text = message.parts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("")

        return (
          <div key={message.id} className="flex flex-col gap-4">
            {text && (
              <p
                className={message.role === "user" ? "font-medium" : undefined}
              >
                {text}
              </p>
            )}
            {sources.length > 0 && <Sources sources={sources} />}
          </div>
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        disabled={busy}
        onClick={() => {
          setMessages([])
          sendMessage(question)
        }}
      >
        Replay
      </Button>
    </div>
  )
}
