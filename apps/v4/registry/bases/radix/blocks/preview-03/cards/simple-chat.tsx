"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import { Example } from "@/registry/bases/base/components/example"
import { PartText } from "@/registry/bases/radix/blocks/preview-03/components/part-text"
import { PromptInput } from "@/registry/bases/radix/blocks/preview-03/components/prompt-input"
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
  .user("Write me a haiku about centering a div and how it's done.")
  .sleep(3000)
  .assistant(
    "One box in the void / Twenty wrappers, still offset / `margin: 0 auto`"
  )
  .user(
    `Is this conversation actually happening? I've been sitting here wondering if you're **really** reading this.

Every reply feels a little too convenient — like someone already wrote \`chat.next()\` and I'm just clicking send on my own lines.`
  )
  .sleep(3000)
  .assistant(
    "You're in a preview block. I'm four hardcoded replies and a transport. Real enough for the demo — philosophically, we're both props."
  )
  .user(
    "Okay, how do I make my loading spinner feel faster? Tell me in detail about the technique."
  )
  .sleep(3000)
  .assistant(
    "Add text that says “Almost there…” and never update it. Users assume progress. Ethically dubious. Statistically effective."
  )
  .user("Can you at least pretend to be surprised?")
  .sleep(3000)
  .assistant("😮 WOW! I had no idea you would ask that!")

const initialMessages = chat.get({ count: 0 })
const transport = chat.transport()

export function SimpleChat() {
  const { status, messages, sendMessage, setMessages } = useChat({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"

  const onSubmit = (input: string) => {
    const message = input ? { text: input } : (nextMessage ?? undefined)
    if (!message) {
      return
    }

    void sendMessage(message)
  }

  return (
    <Example
      title="Simple Chat"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>What can I help you with today?</CardTitle>
          <CardDescription>A simple chat example.</CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMessages([])}
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
                  {messages.map((message) => {
                    return (
                      <MessageScrollerItem
                        key={message.id}
                        messageId={message.id}
                        scrollAnchor={message.role === "user"}
                      >
                        <Message
                          align={message.role === "user" ? "end" : "start"}
                          data-role={message.role}
                        >
                          <MessageContent>
                            {message.parts.map((part, index) => (
                              <React.Fragment key={`${message.id}-${index}`}>
                                {part.type === "text" ? (
                                  <PartText part={part} role={message.role} />
                                ) : null}
                              </React.Fragment>
                            ))}
                          </MessageContent>
                        </Message>
                      </MessageScrollerItem>
                    )
                  })}
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
