"use client"

import * as React from "react"
import {
  ArrowUpIcon,
  MessageCircleDashedIcon,
  RotateCwIcon,
} from "lucide-react"

import { MessageAnimated } from "@/components/message-animated"
import { Button } from "@/styles/base-rhea/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/styles/base-rhea/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/styles/base-rhea/ui/empty"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/styles/base-rhea/ui/message-scroller"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/base-rhea/ui/toggle-group"

type AnchorRole = "user" | "assistant"

type ChatMessage = {
  id: string
  role: AnchorRole
  text: string
}

const scriptedMessages: ChatMessage[] = [
  {
    id: "anchor-1-user",
    role: "user",
    text: "Can you show me how anchoring behaves when a new prompt starts the turn?",
  },
  {
    id: "anchor-1-assistant",
    role: "assistant",
    text: "Append the user prompt first, then append the assistant response. With User selected, the prompt settles near the top and the assistant response fills in below it.",
  },
  {
    id: "anchor-2-user",
    role: "user",
    text: "What changes when assistant messages are the anchor?",
  },
  {
    id: "anchor-2-assistant",
    role: "assistant",
    text: "Now each assistant response is the item `MessageScroller` keeps in view. This is useful when the reply is the moment you want readers to land on after each turn.",
  },
  {
    id: "anchor-3-user",
    role: "user",
    text: "Can I switch roles and keep adding turns?",
  },
  {
    id: "anchor-3-assistant",
    role: "assistant",
    text: "Yes. The next appended message with the selected role becomes the anchor, so you can compare user and assistant anchoring without resetting the demo.",
  },
]

export function MessageScrollerAnchoring() {
  const [anchorRole, setAnchorRole] = React.useState<AnchorRole>("user")
  const [messages, setMessages] = React.useState<ChatMessage[]>([])
  const [messageIndex, setMessageIndex] = React.useState(0)
  const nextMessage = scriptedMessages[messageIndex]

  return (
    <div className="relative flex flex-col gap-4">
      <Card className="mx-auto h-140 w-full max-w-sm gap-0">
        <CardHeader className="border-b">
          <CardTitle>Anchoring Turns</CardTitle>
          <CardDescription>
            Choose which role settles near the top edge.
          </CardDescription>
          <CardAction>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Reset anchored turns"
              disabled={messages.length === 0}
              onClick={() => {
                setMessages([])
                setMessageIndex(0)
              }}
            >
              <RotateCwIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="min-h-0 flex-1 overflow-hidden p-0">
          {messages.length === 0 ? (
            <Empty className="h-full">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MessageCircleDashedIcon />
                </EmptyMedia>
                <EmptyTitle>No anchored messages yet</EmptyTitle>
                <EmptyDescription>
                  Send the first message to see the selected role anchor.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <MessageScrollerProvider>
              <MessageScroller>
                <MessageScrollerViewport>
                  <MessageScrollerContent className="p-(--card-spacing)">
                    {messages.map((message) => (
                      <MessageAnimated
                        key={message.id}
                        message={message}
                        scrollAnchor={message.role === anchorRole}
                        userVariant="muted"
                        assistantVariant="ghost"
                      />
                    ))}
                  </MessageScrollerContent>
                </MessageScrollerViewport>
                <MessageScrollerButton />
              </MessageScroller>
            </MessageScrollerProvider>
          )}
        </CardContent>
        <CardFooter>
          <ToggleGroup
            aria-label="Select scroll anchor role"
            value={[anchorRole]}
            onValueChange={(value) => {
              const nextValue = value[0]

              if (nextValue === "user" || nextValue === "assistant") {
                setAnchorRole(nextValue)
                setMessages([])
                setMessageIndex(0)
              }
            }}
          >
            <ToggleGroupItem value="user" aria-label="Anchor user messages">
              User
            </ToggleGroupItem>
            <ToggleGroupItem
              value="assistant"
              aria-label="Anchor assistant messages"
            >
              Assistant
            </ToggleGroupItem>
          </ToggleGroup>
          <Button
            type="button"
            size="icon"
            className="ml-auto"
            disabled={!nextMessage}
            onClick={() => {
              if (!nextMessage) {
                return
              }

              setMessages((messages) => [...messages, nextMessage])
              setMessageIndex((index) => index + 1)
            }}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send Message</span>
          </Button>
        </CardFooter>
      </Card>
      <div className="mx-auto max-w-xs px-0.5 text-center text-xs text-muted-foreground">
        Toggle the anchor role, then send messages to compare where turns
        settle.
      </div>
    </div>
  )
}
