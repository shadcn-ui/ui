"use client"

import { useChat } from "@ai-sdk/react"
import {
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIDataTypes,
  type UIMessage,
} from "ai"
import { TerminalIcon } from "lucide-react"

import { createChat } from "@/lib/ai"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/styles/base-rhea/ui/item"
import {
  Trace,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/styles/base-rhea/ui/trace"

type ChatMessage = UIMessage<
  unknown,
  UIDataTypes,
  {
    runCommand: {
      input: { command: string }
      output: { stdout: string }
    }
  }
>

const chat = createChat<ChatMessage>()
  .user("Clean up the build folder.")
  .assistant(({ writer }) => {
    writer.tool("runCommand", {
      input: { command: "rm -rf dist" },
      needsApproval: true,
      output: { stdout: "" },
    })
  })
  .assistant(({ writer, toolCall }) => {
    writer.text(
      toolCall?.approved
        ? "Removed the dist folder."
        : "Okay, I left the dist folder in place."
    )
  })

const initialMessages = chat.get(0)
const transport = chat.transport({ delayMs: 20 })

export function ToolApproval() {
  const {
    messages,
    sendMessage,
    setMessages,
    status,
    addToolApprovalResponse,
  } = useChat({
    messages: initialMessages,
    transport,
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
  })
  const nextMessage = chat.next(messages)
  const busy = status === "submitted" || status === "streaming"

  return (
    <div className="flex min-h-72 w-full max-w-sm flex-col gap-4 py-6 text-sm">
      {messages.map((message) => (
        <div key={message.id} className="flex flex-col gap-4">
          {message.parts.map((part, index) => {
            if (part.type === "text") {
              return (
                <p
                  key={index}
                  className={
                    message.role === "user" ? "font-medium" : undefined
                  }
                >
                  {part.text}
                </p>
              )
            }

            if (part.type !== "tool-runCommand") {
              return null
            }

            // A pending approval is a prompt, not activity, so it sits outside Trace.
            if (part.state === "approval-requested") {
              return (
                <Item key={part.toolCallId} variant="outline" size="sm">
                  <ItemMedia variant="icon">
                    <TerminalIcon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Run {part.input.command}?</ItemTitle>
                    <ItemDescription>
                      The command runs in this project.
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        addToolApprovalResponse({
                          id: part.approval.id,
                          approved: false,
                        })
                      }
                    >
                      Deny
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        addToolApprovalResponse({
                          id: part.approval.id,
                          approved: true,
                        })
                      }
                    >
                      Approve
                    </Button>
                  </ItemActions>
                </Item>
              )
            }

            const denied =
              part.state === "output-denied" ||
              (part.state === "approval-responded" && !part.approval.approved)

            return (
              <Trace key={part.toolCallId}>
                <TraceLine
                  status={
                    !denied && part.state !== "output-available"
                      ? "running"
                      : undefined
                  }
                >
                  <TraceIcon>
                    <TerminalIcon />
                  </TraceIcon>
                  <TraceTitle>
                    {denied
                      ? "Denied"
                      : part.state === "output-available"
                        ? "Ran"
                        : "Running"}{" "}
                    {part.input?.command}
                  </TraceTitle>
                </TraceLine>
              </Trace>
            )
          })}
        </div>
      ))}
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
