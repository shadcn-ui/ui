"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIDataTypes, UIMessage } from "ai"
import {
  ArrowUpRightIcon,
  FileTextIcon,
  GlobeIcon,
  SearchIcon,
} from "lucide-react"

import { createChat } from "@/lib/ai"
import { Badge } from "@/styles/aria-rhea/ui/badge"
import { Button } from "@/styles/aria-rhea/ui/button"
import { CodeBlock, CodeBlockContent } from "@/styles/aria-rhea/ui/code-block"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/aria-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    searchWeb: {
      input: { query: string }
      output: { results: { title: string; url: string }[] }
    }
    readBuildLog: {
      input: { deployment: string }
      output: { log: string }
    }
    searchCode: {
      input: { query: string }
      output: { files: string[] }
    }
  }
>

type StepPart = Extract<
  ChatMessage["parts"][number],
  { type: "tool-searchWeb" | "tool-readBuildLog" | "tool-searchCode" }
>

const chat = createChat<ChatMessage>()
  .user("Why is the checkout deploy so slow?")
  .assistant(({ writer }) => {
    writer
      .tool("readBuildLog", { input: { deployment: "dpl_8Kx2" } })
      .sleep(900)
      .output({
        log: "install    41s\ncompile    38s\nimages   3m 52s",
      })
    writer
      .tool("searchWeb", { input: { query: "next.js image cache key" } })
      .sleep(900)
      .output({
        results: [
          {
            title: "Image component | nextjs.org",
            url: "https://nextjs.org/docs/app/api-reference/components/image",
          },
          {
            title: "Build cache | vercel.com",
            url: "https://vercel.com/docs/deployments/troubleshoot-a-build",
          },
        ],
      })
    writer
      .tool("searchCode", { input: { query: "cacheKey" } })
      .sleep(900)
      .output({ files: ["next.config.ts", "scripts/optimize-images.ts"] })
    writer.text(
      "Image optimization takes almost four minutes because its cache key includes the commit hash. Key it on the image directory instead."
    )
  })

const transcript = chat.get()
const [question] = chat.get(1)
const transport = chat.transport({ delayMs: 20 })

function Step({
  icon,
  title,
  status,
  defaultExpanded,
  children,
}: {
  icon: React.ReactNode
  title: string
  status?: "running" | "error"
  defaultExpanded?: boolean
  children?: React.ReactNode
}) {
  const line = (
    <TraceLine status={status}>
      <TraceIcon>{icon}</TraceIcon>
      <TraceTitle>{title}</TraceTitle>
    </TraceLine>
  )

  if (!children) {
    return line
  }

  return (
    <TraceCollapsible defaultExpanded={defaultExpanded}>
      <TraceCollapsibleTrigger>{line}</TraceCollapsibleTrigger>
      <TraceCollapsibleContent>{children}</TraceCollapsibleContent>
    </TraceCollapsible>
  )
}

function StepRow({ part, streaming }: { part: StepPart; streaming: boolean }) {
  const status =
    part.state === "output-available"
      ? undefined
      : part.state === "output-error" || !streaming
        ? "error"
        : "running"
  const verb = (running: string, done: string, failed: string) =>
    status === "running" ? running : status === "error" ? failed : done
  const error = part.state === "output-error" && (
    <CodeBlock size="sm" variant="destructive">
      <CodeBlockContent wrap className="max-h-64">
        {part.errorText}
      </CodeBlockContent>
    </CodeBlock>
  )

  if (part.type === "tool-searchWeb") {
    return (
      <Step
        icon={<GlobeIcon />}
        status={status}
        title={`${verb("Searching", "Searched", "Failed to search")} the web for ${part.input?.query}`}
      >
        {error ||
          (part.state === "output-available" && (
            <Trace>
              {part.output.results.map((result) => (
                <a
                  key={result.url}
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TraceLine>
                    <TraceIcon>
                      <GlobeIcon />
                    </TraceIcon>
                    <TraceTitle>
                      {result.title}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </TraceTitle>
                    <TraceIcon>
                      <ArrowUpRightIcon />
                    </TraceIcon>
                  </TraceLine>
                </a>
              ))}
            </Trace>
          ))}
      </Step>
    )
  }

  if (part.type === "tool-readBuildLog") {
    return (
      <Step
        icon={<FileTextIcon />}
        status={status}
        defaultExpanded
        title={`${verb("Reading", "Read", "Failed to read")} the build log for ${part.input?.deployment}`}
      >
        {error ||
          (part.state === "output-available" && (
            <CodeBlock size="sm">
              <CodeBlockContent wrap className="max-h-64">
                {part.output.log}
              </CodeBlockContent>
            </CodeBlock>
          ))}
      </Step>
    )
  }

  return (
    <Step
      icon={<SearchIcon />}
      status={status}
      title={`${verb("Searching", "Searched", "Failed to search")} the code for ${part.input?.query}`}
    >
      {error ||
        (part.state === "output-available" && (
          <div className="flex flex-wrap gap-1.5">
            {part.output.files.map((file) => (
              <Badge key={file} variant="secondary" className="font-mono">
                {file}
              </Badge>
            ))}
          </div>
        ))}
    </Step>
  )
}

function ChainOfThought({
  steps,
  streaming,
  answering,
}: {
  steps: StepPart[]
  streaming: boolean
  answering: boolean
}) {
  // A finished turn starts open so the steps show on first paint.
  const [open, setOpen] = React.useState<boolean | undefined>(
    streaming ? undefined : true
  )
  const running = streaming && !answering
  const failed = steps.filter((part) => part.state === "output-error").length

  return (
    <Trace>
      <TraceCollapsible isExpanded={open ?? running} onExpandedChange={setOpen}>
        <TraceCollapsibleTrigger>
          <TraceLine
            status={running ? "running" : failed > 0 ? "error" : undefined}
          >
            <TraceTitle>
              {running
                ? "Researching"
                : `Researched in ${steps.length} steps${failed > 0 ? `, ${failed} failed` : ""}`}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <Trace>
            {steps.map((part) => (
              <StepRow
                key={part.toolCallId}
                part={part}
                streaming={streaming}
              />
            ))}
          </Trace>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

export function ChainOfThoughtDemo() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: transcript,
    transport,
  })
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => {
        const streaming = busy && message === messages.at(-1)
        const steps = message.parts.filter(
          (part) =>
            part.type === "tool-searchWeb" ||
            part.type === "tool-readBuildLog" ||
            part.type === "tool-searchCode"
        )
        const text = message.parts
          .map((part) => (part.type === "text" ? part.text : ""))
          .join("")

        return (
          <div key={message.id} className="flex flex-col gap-4">
            {steps.length > 0 && (
              <ChainOfThought
                steps={steps}
                streaming={streaming}
                answering={text.length > 0}
              />
            )}
            {text && (
              <p
                className={message.role === "user" ? "font-medium" : undefined}
              >
                {text}
              </p>
            )}
          </div>
        )
      })}
      <Button
        variant="outline"
        size="sm"
        className="mt-auto self-start"
        isDisabled={busy}
        onPress={() => {
          setMessages([])
          sendMessage(question)
        }}
      >
        Replay
      </Button>
    </div>
  )
}
