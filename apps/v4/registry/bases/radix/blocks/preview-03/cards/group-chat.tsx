"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import type { UIMessage } from "ai"

import { createChat, getMessageText } from "@/lib/ai"
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
import {
  Message,
  MessageContent,
  MessageHeader,
} from "@/registry/bases/radix/ui/message"
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

type Metadata = {
  name?: string
}

type ChatEventUserLeft = {
  type: "user-left"
  name: string
}

type ChatEventUserJoined = {
  type: "user-joined"
  name: string
}

type ChatEventUserTyping = {
  type: "user-typing"
  name: string
}

type ChatEvent = ChatEventUserLeft | ChatEventUserJoined | ChatEventUserTyping

type DataTypes = {
  event: ChatEvent
}

type ChatMessage = UIMessage<Metadata, DataTypes>

const chat = createChat<Metadata, DataTypes>()
  .user(
    "Hey everyone — dinner this Saturday? I was thinking something casual at my place."
  )
  .sleep(2000)
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-joined",
      name: "Stella",
    },
  })
  .sleep(2000)
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-typing",
      name: "Stella",
    },
  })
  .user(
    "I'm in! Should we do potluck or does someone want to cook the whole thing?",
    {
      metadata: {
        name: "Stella",
      },
    }
  )
  .sleep(2000)
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-joined",
      name: "Marcus",
    },
  })
  .sleep(2000)
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-typing",
      name: "Marcus",
    },
  })
  .sleep(5000)
  .user("Potluck sounds good. I can handle appetizers and drinks.", {
    metadata: {
      name: "Marcus",
    },
  })
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-joined",
      name: "Aleena",
    },
  })
  .sleep(2000)
  .user("Alright! Aleena?")
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-typing",
      name: "Aleena",
    },
  })
  .sleep(3000)
  .user("Can't make it. I'm out of town. 😭", {
    metadata: {
      name: "Aleena",
    },
  })
  .sleep(2000)
  .user("Sorry guys, let's catch up another time. Bye.", {
    metadata: {
      name: "Aleena",
    },
  })
  .sleep(2000)
  .data({
    type: "data-event",
    transient: true,
    data: {
      type: "user-left",
      name: "Aleena",
    },
  })
  .user(
    "@chat, can you suggest a menu and split up what each of us should bring?"
  )
  .sleep(1000)
  .assistant(
    `Here's a simple **Saturday potluck** for the three of you:

**Who brings what**
- **You:** main — salmon or mushroom risotto
- **Stella:** salad + bread
- **Marcus:** appetizers + drinks
- **Chat:** dessert ideas below

**Menu**
- **Starter:** caprese skewers or whipped ricotta crostini
- **Main:** lemon-herb salmon with roasted asparagus *(or risotto for vegetarians)*
- **Side:** arugula salad with shaved parmesan
- **Dessert:** berry crisp or pistachio gelato

**Timing:** aim for **6:30 PM** so Marcus can set up apps while you finish the main.

Want me to scale this for **6 guests** or swap the main for something vegetarian-only?`
  )

const INITIAL_MESSAGE_COUNT = 0

const initialMessages = chat.get({ count: INITIAL_MESSAGE_COUNT })
const transport = chat.transport()

export function GroupChat() {
  const eventRunRef = React.useRef(0)
  const [events, setEvents] = React.useState<
    Array<ChatEvent & { order: number; delayMs: number }>
  >(() =>
    chat.getData({ count: INITIAL_MESSAGE_COUNT }).map((part) => ({
      ...part.data,
      order: part.order,
      delayMs: part.delayMs,
    }))
  )
  const { status, messages, sendMessage, setMessages } = useChat<ChatMessage>({
    messages: initialMessages,
    transport,
    onData: (part) => {
      if (part.type === "data-event") {
        if (
          part.data.type === "user-typing" &&
          messages.some((message) => message.metadata?.name === part.data.name)
        ) {
          return
        }

        const scriptedPart = chat
          .getData()
          .find(
            (currentPart) =>
              currentPart.data.type === part.data.type &&
              currentPart.data.name === part.data.name
          )

        setEvents((events) =>
          [
            ...events.filter(
              (event) =>
                !(
                  event.type === part.data.type && event.name === part.data.name
                )
            ),
            {
              ...part.data,
              order: scriptedPart?.order ?? messages.length - 0.5,
              delayMs: scriptedPart?.delayMs ?? 0,
            },
          ].sort((a, b) => a.order - b.order)
        )
      }
    },
  })
  const nextMessage = chat.next({ after: messages })
  const isBusy = status === "submitted" || status === "streaming"
  const senderName = nextMessage?.metadata?.name ?? "You"

  const onSubmit = (input: string) => {
    if (!input.trim()) {
      return
    }

    if (nextMessage && input === getMessageText(nextMessage)) {
      const message = nextMessage
      const messageIndex = messages.length
      const eventRun = eventRunRef.current + 1
      const nextEvents = chat
        .getData()
        .filter((part) => part.order > messageIndex)
        .filter((part) => part.order < messageIndex + 1)
        .map((part) => ({
          ...part.data,
          order: part.order,
          delayMs: part.delayMs,
        }))
        .filter(
          (event) =>
            !(
              event.type === "user-typing" &&
              event.name === message.metadata?.name
            )
        )

      eventRunRef.current = eventRun
      setEvents((events) =>
        events.filter(
          (event) =>
            !(
              event.type === "user-typing" &&
              event.name === message.metadata?.name
            )
        )
      )

      if (getMessageText(message).trim().toLowerCase().startsWith("@chat,")) {
        void sendMessage(nextMessage)
        return
      }

      setMessages((messages) => [...messages, message])

      void (async () => {
        let previousDelayMs = 0

        for (const event of nextEvents) {
          const delayMs = Math.max(0, event.delayMs - previousDelayMs)
          previousDelayMs = event.delayMs

          if (delayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, delayMs))
          }

          if (eventRunRef.current !== eventRun) {
            return
          }

          setEvents((events) =>
            [
              ...events.filter(
                (currentEvent) =>
                  !(
                    currentEvent.type === event.type &&
                    currentEvent.name === event.name
                  )
              ),
              event,
            ].sort((a, b) => a.order - b.order)
          )
        }
      })()
      return
    }

    void sendMessage({
      text: input,
    })
  }

  return (
    <Example
      title="Group Chat"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>Saturday dinner plans</CardTitle>
          <CardDescription className="leading-relaxed">
            A group chat with multiple users. Includes tinted bubbles for user
            messages.
          </CardDescription>
          <CardAction>
            <Button
              variant="outline"
              size="icon"
              aria-label="Start over"
              onClick={() => {
                eventRunRef.current += 1
                setMessages(initialMessages)
                setEvents(
                  chat
                    .getData({ count: INITIAL_MESSAGE_COUNT })
                    .map((part) => ({
                      ...part.data,
                      order: part.order,
                      delayMs: part.delayMs,
                    }))
                )
              }}
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
                  {messages.map((message, index) => {
                    const isOwnMessage =
                      message.role === "user" &&
                      message.metadata?.name === undefined
                    const startsModelTurn = getMessageText(message)
                      .trim()
                      .toLowerCase()
                      .startsWith("@chat,")

                    return (
                      <React.Fragment key={message.id}>
                        <MessageScrollerItem
                          messageId={message.id}
                          scrollAnchor={startsModelTurn}
                        >
                          <Message
                            align={isOwnMessage ? "end" : "start"}
                            data-role={message.role}
                          >
                            {!isOwnMessage && (
                              <MessageHeader>
                                {message.role === "assistant"
                                  ? "Chat"
                                  : message.metadata?.name || "Unknown"}
                              </MessageHeader>
                            )}
                            <MessageContent>
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
                                      tinted={isOwnMessage}
                                    />
                                  ) : null}
                                </React.Fragment>
                              ))}
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                        {events
                          .filter((event) => event.order > index)
                          .filter((event) => event.order < index + 1)
                          .map((event) => (
                            <MessageScrollerItem
                              key={`${event.type}-${event.name}-${event.order}`}
                              scrollAnchor={false}
                            >
                              <Marker
                                variant={
                                  event.type === "user-typing"
                                    ? "default"
                                    : "separator"
                                }
                                role={
                                  event.type === "user-typing"
                                    ? "status"
                                    : undefined
                                }
                              >
                                <MarkerContent>
                                  {event.type === "user-joined"
                                    ? `${event.name} joined the chat`
                                    : event.type === "user-left"
                                      ? `${event.name} left the chat`
                                      : `${event.name} is typing...`}
                                </MarkerContent>
                              </Marker>
                            </MessageScrollerItem>
                          ))}
                      </React.Fragment>
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
        <CardFooter className="flex-col items-stretch gap-2">
          <p className="px-1 text-xs text-muted-foreground">
            Posting as {senderName}.
          </p>
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
