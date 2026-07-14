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

type ScriptedChatEvent = ChatEvent & {
  order: number
  delayMs: number
}

type ChatMessage = UIMessage<Metadata>

const scriptedEvents = [
  { type: "user-joined", name: "Stella", order: 0.5, delayMs: 2000 },
  { type: "user-typing", name: "Stella", order: 0.5, delayMs: 4000 },
  { type: "user-joined", name: "Marcus", order: 1.5, delayMs: 2000 },
  { type: "user-typing", name: "Marcus", order: 1.5, delayMs: 4000 },
  { type: "user-joined", name: "Aleena", order: 2.5, delayMs: 0 },
  { type: "user-typing", name: "Aleena", order: 3.5, delayMs: 0 },
  { type: "user-left", name: "Aleena", order: 5.5, delayMs: 2000 },
] satisfies ScriptedChatEvent[]

const chat = createChat<Metadata>()
  .user(
    "Hey everyone — dinner this Saturday? I was thinking something casual at my place."
  )
  .user(
    "I'm in! Should we do potluck or does someone want to cook the whole thing?",
    {
      metadata: {
        name: "Stella",
      },
    }
  )
  .user("Potluck sounds good. I can handle appetizers and drinks.", {
    metadata: {
      name: "Marcus",
    },
  })
  .user("Alright! Aleena?")
  .user("Can't make it. I'm out of town. 😭", {
    metadata: {
      name: "Aleena",
    },
  })
  .user("Sorry guys, let's catch up another time. Bye.", {
    metadata: {
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

const initialMessages = chat.get(INITIAL_MESSAGE_COUNT)
const transport = chat.transport()

export function GroupChat() {
  const eventRunRef = React.useRef(0)
  const [events, setEvents] = React.useState<ScriptedChatEvent[]>(() =>
    scriptedEvents.filter((event) => event.order < INITIAL_MESSAGE_COUNT)
  )
  const { status, messages, sendMessage, setMessages } = useChat<ChatMessage>({
    messages: initialMessages,
    transport,
  })
  const nextMessage = chat.next(messages)
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
      const nextEvents = scriptedEvents
        .filter((event) => event.order > messageIndex)
        .filter((event) => event.order < messageIndex + 1)
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
                  scriptedEvents.filter(
                    (event) => event.order < INITIAL_MESSAGE_COUNT
                  )
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
