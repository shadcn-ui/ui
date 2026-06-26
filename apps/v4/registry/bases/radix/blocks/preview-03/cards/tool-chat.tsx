"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { PartReasoning } from "@/registry/bases/radix/blocks/preview-03/components/part-reasoning"
import { PartText } from "@/registry/bases/radix/blocks/preview-03/components/part-text"
import { PartTool } from "@/registry/bases/radix/blocks/preview-03/components/part-tool"
import { PromptInput } from "@/registry/bases/radix/blocks/preview-03/components/prompt-input"
import { Example } from "@/registry/bases/radix/components/example"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/bases/radix/ui/marker"
import { Message, MessageContent } from "@/registry/bases/radix/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/registry/bases/radix/ui/message-scroller"
import { Spinner } from "@/registry/bases/radix/ui/spinner"
import { IconPlaceholder } from "@/app/(app)/create/components/icon-placeholder"

type Tools = {
  getDeploymentHealth: {
    input: {
      project: string
      region: string
    }
    output: {
      status: "healthy" | "degraded" | "down"
      p95: number
      errors: number
      recommendation: string
    }
  }
}

const chat = createChat<unknown, Record<string, never>, Tools>()
  .user("Check the deployment health for the checkout flow.")
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.reasoning(
      "The user needs current operational state, so I should call a deployment-health tool before making a recommendation."
    )
    const health = writer.tool("getDeploymentHealth", {
      title: "Checking deployment health",
      input: {
        project: "checkout",
        region: "iad1",
      },
    })

    health.sleep(1200).output({
      status: "healthy",
      p95: 186,
      errors: 2,
      recommendation: "No rollback needed. Watch error rate for 15 minutes.",
    })

    writer.text(
      "The checkout deployment looks healthy. P95 latency is **186ms** with **2 recent errors**, so I would keep the release live and watch it for another 15 minutes."
    )
  })

const initialMessages = chat.get({ count: 0 })
const transport = chat.transport()

function isToolPart(part: {
  type: string
}): part is React.ComponentProps<typeof PartTool>["part"] {
  return part.type === "dynamic-tool" || part.type.startsWith("tool-")
}

export function ToolChat() {
  const { status, messages, sendMessage, setMessages } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"

  const onSubmit = (input: string) => {
    if (!input.trim()) {
      return
    }

    if (nextMessage && input === getMessageText(nextMessage)) {
      void sendMessage(nextMessage)
      return
    }

    void sendMessage({ text: input })
  }

  return (
    <Example
      title="Reasoning + Tool"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>Deployment check</CardTitle>
          <CardDescription>
            Reasoning followed by a tool call and result.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              aria-label="Start over"
              onClick={() => setMessages(initialMessages)}
            >
              <IconPlaceholder
                lucide="PlusIcon"
                tabler="IconPlus"
                hugeicons="PlusSignIcon"
                phosphor="PlusIcon"
                remixicon="RiAddLine"
              />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent>
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                      scrollAnchor={message.role === "user"}
                    >
                      <Message
                        align={message.role === "user" ? "end" : "start"}
                        data-role={message.role}
                      >
                        <MessageContent
                          className={
                            message.role === "user"
                              ? "flex-col items-end gap-2"
                              : "flex-col items-start gap-2"
                          }
                        >
                          {message.parts.map((part, index) => (
                            <React.Fragment key={`${message.id}-${index}`}>
                              {part.type === "text" ? (
                                <PartText
                                  part={part}
                                  variant={
                                    message.role === "user"
                                      ? "bubble"
                                      : "default"
                                  }
                                />
                              ) : part.type === "reasoning" ? (
                                <PartReasoning part={part} />
                              ) : isToolPart(part) ? (
                                <PartTool part={part} />
                              ) : null}
                            </React.Fragment>
                          ))}
                        </MessageContent>
                      </Message>
                    </MessageScrollerItem>
                  ))}
                  {status === "submitted" ? (
                    <MessageScrollerItem scrollAnchor={false}>
                      <Marker role="status">
                        <MarkerIcon>
                          <Spinner />
                        </MarkerIcon>
                        <MarkerContent>Thinking...</MarkerContent>
                      </Marker>
                    </MessageScrollerItem>
                  ) : null}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter>
          <PromptInput
            onSubmit={onSubmit}
            status={status}
            defaultValue={
              isBusy ? "" : nextMessage ? getMessageText(nextMessage) : ""
            }
          />
        </CardFooter>
      </Card>
    </Example>
  )
}
