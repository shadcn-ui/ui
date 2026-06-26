"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { PartFile } from "@/registry/bases/radix/blocks/preview-03/components/part-file"
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
  .user("Review these files and tell me what stands out.", {
    files: [
      {
        filename: "workspace.png",
        mediaType: "image/png",
        url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=900&auto=format&fit=crop&q=80",
      },
      {
        filename: "research-brief.pdf",
        mediaType: "application/pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      },
    ],
  })
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.text(
      "The image reads like a focused workspace, while the document should be treated as the source of record. I would summarize the PDF first, then use the image only as supporting context."
    )
    writer.file({
      filename: "annotated-workspace.png",
      mediaType: "image/png",
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=900&auto=format&fit=crop&q=80",
    })
    writer.file({
      filename: "file-review-notes.pdf",
      mediaType: "application/pdf",
      url: "https://example.com/file-review-notes.pdf",
    })
  })

const initialMessages = chat.get({ count: 0 })
const transport = chat.transport()

export function FilesChat() {
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
      title="Files"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>File review</CardTitle>
          <CardDescription>Image and document file parts.</CardDescription>
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
        <CardContent className="flex-1 overflow-hidden p-0">
          <MessageScrollerProvider>
            <MessageScroller>
              <MessageScrollerViewport>
                <MessageScrollerContent className="p-(--card-spacing)">
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
                          {message.parts.map((part, index) =>
                            part.type === "file" ? (
                              <PartFile
                                key={`${message.id}-${index}`}
                                part={part}
                              />
                            ) : null
                          )}
                          {message.parts.map((part, index) =>
                            part.type === "text" ? (
                              <PartText
                                key={`${message.id}-${index}`}
                                part={part}
                                variant={
                                  message.role === "user" ? "bubble" : "default"
                                }
                              />
                            ) : null
                          )}
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
