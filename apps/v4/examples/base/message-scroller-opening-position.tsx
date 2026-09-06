"use client"

import * as React from "react"

import { Bubble, BubbleContent } from "@/styles/base-rhea/ui/bubble"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-rhea/ui/card"
import { Message, MessageContent } from "@/styles/base-rhea/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
} from "@/styles/base-rhea/ui/message-scroller"
import { Tabs, TabsList, TabsTrigger } from "@/styles/base-rhea/ui/tabs"

const messages = [
  {
    id: "open-1",
    role: "user",
    text: "This is the first message the user sent in the conversation.",
  },
  {
    id: "open-2",
    role: "assistant",
    text: "Workspace creation rose 8%, but first invite completion only rose 2%.",
  },
  {
    id: "open-3",
    role: "user",
    text: "This is the last message the user sent in the conversation.",
  },
  {
    id: "open-4",
    role: "assistant",
    text: "Start with the invite step. Teams are creating workspaces but waiting to add collaborators.\n\nRecommended follow-up:\n\n1. Compare invite drop-off by account size.\n2. Check whether users who skip invites still return within 24 hours.\n3. Review the empty-state copy on the first project screen.\n4. Segment activation by template, since template users may not need invites right away.\n\nIf that pattern holds, the next experiment should make collaboration useful earlier instead of prompting for invites harder.",
  },
] satisfies Array<{
  id: string
  role: "user" | "assistant"
  text: string
}>

const positions = [
  { value: "start", label: "start" },
  { value: "end", label: "end" },
  { value: "last-anchor", label: "last-anchor" },
] satisfies Array<{
  value: "start" | "end" | "last-anchor"
  label: string
}>

export function MessageScrollerOpeningPosition() {
  const [positionKey, setPositionKey] = React.useState(0)
  const [position, setPosition] = React.useState<
    "start" | "end" | "last-anchor"
  >("last-anchor")

  return (
    <div className="relative flex flex-col gap-4">
      <Card className="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader className="gap-1 border-b">
          <CardTitle>Opening Position</CardTitle>
          <CardDescription>
            Choose where a saved transcript opens.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden p-0">
          <MessageScrollerProvider>
            <OpeningPositionScroller
              position={position}
              positionKey={positionKey}
            />
          </MessageScrollerProvider>
        </CardContent>
        <CardFooter className="flex items-center justify-center border-t">
          <Tabs
            value={position}
            onValueChange={(value) => {
              if (
                value === "start" ||
                value === "end" ||
                value === "last-anchor"
              ) {
                setPosition(value)
                setPositionKey((key) => key + 1)
              }
            }}
            className="w-full"
          >
            <TabsList className="w-full">
              {positions.map((option) => (
                <TabsTrigger key={option.value} value={option.value}>
                  {option.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-sm px-0.5 text-center text-xs text-muted-foreground">
        Toggle the defaultScrollPosition to see where the transcript starts when
        you open the thread
      </div>
    </div>
  )
}

function OpeningPositionScroller({
  position,
  positionKey,
}: {
  position: "start" | "end" | "last-anchor"
  positionKey: number
}) {
  const { scrollToEnd, scrollToMessage, scrollToStart } = useMessageScroller()

  React.useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (position === "start") {
        scrollToStart({ behavior: "auto" })
        return
      }

      if (position === "end") {
        scrollToEnd({ behavior: "auto" })
        return
      }

      scrollToMessage("open-3", {
        align: "start",
        behavior: "auto",
        scrollMargin: 64,
      })
    })

    return () => {
      cancelAnimationFrame(frame)
    }
  }, [position, positionKey, scrollToEnd, scrollToMessage, scrollToStart])

  return (
    <MessageScroller>
      <MessageScrollerViewport>
        <MessageScrollerContent className="p-(--card-spacing)">
          {messages.map((message) => {
            const isUserMessage = message.role === "user"

            return (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id}
                scrollAnchor={isUserMessage}
              >
                <Message align={isUserMessage ? "end" : "start"}>
                  <MessageContent>
                    <Bubble variant={isUserMessage ? "muted" : "ghost"}>
                      <BubbleContent className="space-y-2">
                        {message.text
                          .split(/\n\s*\n/)
                          .map((paragraph) => paragraph.trim())
                          .filter(Boolean)
                          .map((paragraph, index) => (
                            <p key={index} className="whitespace-pre-wrap">
                              {paragraph}
                            </p>
                          ))}
                      </BubbleContent>
                    </Bubble>
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            )
          })}
        </MessageScrollerContent>
      </MessageScrollerViewport>
      <MessageScrollerButton />
    </MessageScroller>
  )
}
