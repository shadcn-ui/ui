"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { DynamicToolUIPart, UIMessage } from "ai"
import { TerminalIcon } from "lucide-react"

import { createChat, getMessageText } from "@/lib/ai"
import { Bubble, BubbleContent } from "@/styles/base-rhea/ui/bubble"
import { Button } from "@/styles/base-rhea/ui/button"
import { CodeBlock, CodeBlockContent } from "@/styles/base-rhea/ui/code-block"
import { Message, MessageContent } from "@/styles/base-rhea/ui/message"
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
  .user("Which package managers are installed?")
  .assistant(({ writer }) => {
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "node --version" },
      })
      .sleep(900)
      .output({ stdout: "v24.18.0" })
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "npm --version" },
      })
      .sleep(900)
      .output({ stdout: "11.6.2" })
    writer
      .tool("runCommand", {
        dynamic: true,
        input: { command: "pnpm --version" },
      })
      .sleep(900)
      .error("command not found: pnpm")
    writer.text("Node 24 and npm 11 are installed. pnpm is not.")
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

function ToolTrace({ part, live }: { part: DynamicToolUIPart; live: boolean }) {
  const command = (part.input as { command?: string } | undefined)?.command

  if (part.state === "output-available" || part.state === "output-error") {
    const failed = part.state === "output-error"

    return (
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine status={failed ? "error" : undefined}>
            <TraceIcon>
              <TerminalIcon />
            </TraceIcon>
            <TraceTitle>
              {failed ? "Failed to run" : "Ran"} {command}
            </TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent wrap className="max-h-64">
              {failed
                ? part.errorText
                : (part.output as { stdout: string }).stdout}
            </CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    )
  }

  if (part.state === "output-denied") {
    return (
      <TraceLine>
        <TraceIcon>
          <TerminalIcon />
        </TraceIcon>
        <TraceTitle>Denied {command}</TraceTitle>
      </TraceLine>
    )
  }

  return (
    <TraceLine status={live ? "running" : "error"}>
      <TraceIcon>
        <TerminalIcon />
      </TraceIcon>
      <TraceTitle>
        {live ? "Running" : "Failed to run"} {command}
      </TraceTitle>
    </TraceLine>
  )
}

function groupParts(parts: UIMessage["parts"]) {
  const runs: { trace: boolean; parts: UIMessage["parts"] }[] = []

  for (const part of parts) {
    const trace = part.type === "dynamic-tool"

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

export function TraceToolCalls() {
  const { messages, sendMessage, setMessages, status } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
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

        const live = status === "streaming" && message === messages.at(-1)

        return (
          <Message key={message.id}>
            <MessageContent className="gap-4">
              {groupParts(message.parts).map((run, runIndex) =>
                run.trace ? (
                  <Trace key={runIndex}>
                    {run.parts.map((part) =>
                      part.type === "dynamic-tool" ? (
                        <ToolTrace
                          key={part.toolCallId}
                          part={part}
                          live={live}
                        />
                      ) : null
                    )}
                  </Trace>
                ) : (
                  run.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p key={`${runIndex}-${index}`}>{part.text}</p>
                    ) : null
                  )
                )
              )}
            </MessageContent>
          </Message>
        )
      })}
      {!busy && (
        <Button
          variant="outline"
          size="sm"
          className="mt-auto self-start"
          onClick={() =>
            nextMessage
              ? sendMessage(nextMessage)
              : setMessages(initialMessages)
          }
        >
          {nextMessage ? "Send message" : "Reset"}
        </Button>
      )}
    </div>
  )
}
