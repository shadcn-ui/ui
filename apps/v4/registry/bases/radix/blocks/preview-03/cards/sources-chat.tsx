"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { PartSource } from "@/registry/bases/radix/blocks/preview-03/components/part-source"
import { PartText } from "@/registry/bases/radix/blocks/preview-03/components/part-text"
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

const chat = createChat()
  .user("What should I read before migrating message rendering?")
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.sourceUrl({
      sourceId: "source-ai-sdk-ui-message",
      title: "AI SDK UIMessage",
      url: "https://ai-sdk.dev/docs/reference/ai-sdk-core/ui-message",
    })
    writer.sourceUrl({
      sourceId: "source-ai-sdk-transport",
      title: "AI SDK transport",
      url: "https://ai-sdk.dev/docs/ai-sdk-ui/transport",
    })
    writer.sourceDocument({
      sourceId: "source-migration-notes",
      title: "Internal migration notes",
      filename: "message-rendering-plan.md",
      mediaType: "text/markdown",
    })
    writer.text(
      "Start with the **UIMessage** shape, then read the transport docs so your renderer understands streamed parts. The migration notes should stay close to the component work because they capture the local composition decisions."
    )
  })

const initialMessages = chat.get({ count: 0 })
const transport = chat.transport()

export function SourcesChat() {
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
      title="Sources"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>Reading list</CardTitle>
          <CardDescription>
            Source URL and source document parts.
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
                              ) : part.type === "source-url" ||
                                part.type === "source-document" ? (
                                <PartSource part={part} />
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
