"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"

import { createChat, getMessageText } from "@/lib/ai"
import {
  getReasoningLevelLabel,
  PartReasoning,
} from "@/registry/bases/radix/blocks/preview-03/components/part-reasoning"
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
  .user("Explain why the dashboard feels slow even though the API is fast.")
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.reasoning(
      `The user is separating perceived performance from backend latency. They likely measured API response times and found them acceptable, but users still complain about slowness.

I should avoid jumping straight to server-side optimizations and instead frame the answer around what people actually experience.`
    )
    writer.sleep(600)
    writer.reasoning(
      `Perceived slowness usually lives in the gap between user action and visible feedback:

- input latency before the request fires
- loading state placement and timing
- layout shifts when data arrives
- whether optimistic UI gives immediate acknowledgment

For a dashboard, I should also consider chart re-renders, independent card fetches, and skeleton dimensions that do not match the final layout.`
    )
    writer.sleep(600)
    writer.reasoning(
      `Ranking likely bottlenecks for this scenario:

1. No immediate feedback on filter or refresh actions
2. Skeleton cards that collapse or expand when data lands
3. Waterfall requests where each widget fetches on its own
4. Empty-state flashes because stale data is not shown while revalidating

The answer should stay practical and ordered by impact, not by how technical each fix sounds.`
    )
    writer.text(
      `The API can be fast while the interface still **feels** slow.

Start by checking:

- whether the button gives immediate feedback
- whether skeletons match the final layout
- whether any reflow happens after data arrives
- whether the loading state appears near the content it replaces`
    )
  })
  .user("What should I fix first?")
  .sleep(1000)
  .assistant(({ writer }) => {
    writer.reasoning(
      `The user wants prioritization, not another diagnostic list.

Given the dashboard context, immediate feedback and layout stability usually beat micro-optimizations. I should recommend one fix with a clear way to measure success.`
    )
    writer.text(
      `Fix **immediate feedback** first.

When someone clicks "Refresh", the button should disable and show a spinner within one frame — before the network round trip. That single change often cuts perceived latency in half.

Measure it with a screen recording and count frames between click and visual response.`
    )
  })

const initialMessages = chat.get({ count: 0 })
const transport = chat.transport()

export function ReasoningChat() {
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
      title="Reasoning"
      className="bg-transparent p-0"
      containerClassName="flex-1"
    >
      <Card className="max-h-140 min-h-0 flex-1">
        <CardHeader>
          <CardTitle>Reasoning trace</CardTitle>
          <CardDescription>
            Layered reasoning traces across multiple assistant turns.
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
                          {message.parts.map((part, index) => {
                            const reasoningIndex =
                              part.type === "reasoning"
                                ? message.parts
                                    .slice(0, index)
                                    .filter(
                                      (currentPart) =>
                                        currentPart.type === "reasoning"
                                    ).length
                                : 0

                            return (
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
                                  <PartReasoning
                                    part={part}
                                    label={getReasoningLevelLabel(
                                      reasoningIndex
                                    )}
                                  />
                                ) : null}
                              </React.Fragment>
                            )
                          })}
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
