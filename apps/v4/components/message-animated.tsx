"use client"

import * as React from "react"
import { BrainIcon } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"

import type { MessageAnimationPreset } from "@/lib/message-animations"
import { MESSAGE_ANIMATIONS } from "@/lib/message-animations"
import { Bubble, BubbleContent } from "@/styles/radix-rhea/ui/bubble"
import { Message, MessageContent } from "@/styles/radix-rhea/ui/message"
import { MessageScrollerItem } from "@/styles/radix-rhea/ui/message-scroller"

type MessageAnimatedPart = {
  content?: unknown
  type: string
  text?: unknown
}

type MessageAnimatedMessage = {
  id: string
  role: string
  text?: string
  parts?: ReadonlyArray<MessageAnimatedPart>
}

const MotionMessageScrollerItem = motion.create(MessageScrollerItem)

function MessageAnimated({
  message,
  animationPreset = MESSAGE_ANIMATIONS["slide-up"],
  assistantVariant = "ghost",
  scrollAnchor,
  userVariant = "muted",
  ...props
}: Omit<
  React.ComponentProps<typeof MotionMessageScrollerItem>,
  "animate" | "children" | "exit" | "initial" | "messageId" | "variants"
> & {
  animationPreset?: MessageAnimationPreset
  assistantVariant?: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  userVariant?: React.ComponentProps<typeof Bubble>["variant"]
}) {
  const shouldReduceMotion = useReducedMotion()
  const isUserMessage = message.role === "user"

  if (isUserMessage) {
    return (
      <MotionMessageScrollerItem
        messageId={message.id}
        scrollAnchor={scrollAnchor ?? true}
        variants={animationPreset.variants}
        initial={shouldReduceMotion ? false : "initial"}
        animate="animate"
        exit={shouldReduceMotion ? undefined : "exit"}
        {...props}
      >
        <MessageAnimatedRow
          message={message}
          assistantVariant={assistantVariant}
          userVariant={userVariant}
        />
      </MotionMessageScrollerItem>
    )
  }

  return (
    <MotionMessageScrollerItem
      messageId={message.id}
      scrollAnchor={scrollAnchor}
      initial={false}
      {...props}
    >
      <MessageAnimatedRow
        message={message}
        assistantVariant={assistantVariant}
        userVariant={userVariant}
      />
    </MotionMessageScrollerItem>
  )
}

function MessageAnimatedRow({
  message,
  assistantVariant,
  userVariant,
}: {
  assistantVariant: React.ComponentProps<typeof Bubble>["variant"]
  message: MessageAnimatedMessage
  userVariant: React.ComponentProps<typeof Bubble>["variant"]
}) {
  const isUserMessage = message.role === "user"
  const parts = getMessageAnimatedContentParts(message)

  return (
    <Message align={isUserMessage ? "end" : "start"}>
      <MessageContent>
        {parts.map((part) => {
          const paragraphs = part.text
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)

          if (part.type === "reasoning") {
            return (
              <div
                key={part.key}
                className="w-full border-l-2 border-muted-foreground/30 pl-3 text-muted-foreground"
              >
                <div className="mb-1 flex items-center gap-1.5 text-xs font-medium">
                  <BrainIcon className="size-3.5" />
                  Reasoning
                </div>
                <div className="space-y-1.5 text-sm">
                  {paragraphs.map((paragraph, paragraphIndex) => (
                    <p
                      key={`${part.key}-${paragraphIndex}`}
                      className="whitespace-pre-wrap"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )
          }

          return (
            <Bubble
              key={part.key}
              variant={isUserMessage ? userVariant : assistantVariant}
            >
              <BubbleContent className="space-y-2">
                {paragraphs.map((paragraph, paragraphIndex) => (
                  <p
                    key={`${part.key}-${paragraphIndex}`}
                    className="whitespace-pre-wrap"
                  >
                    {paragraph}
                  </p>
                ))}
              </BubbleContent>
            </Bubble>
          )
        })}
      </MessageContent>
    </Message>
  )
}

function getMessageAnimatedContentParts(message: MessageAnimatedMessage) {
  if (message.parts) {
    return message.parts.flatMap((part, index) => {
      const type =
        part.type === "reasoning" || part.type === "thinking"
          ? "reasoning"
          : part.type === "text"
            ? "text"
            : null
      const text =
        typeof part.text === "string"
          ? part.text
          : typeof part.content === "string"
            ? part.content
            : null

      if (!type || text === null) {
        return []
      }

      return [
        {
          key: `${message.id}-${index}`,
          text,
          type,
        },
      ]
    })
  }

  return typeof message.text === "string"
    ? [{ key: `${message.id}-text`, text: message.text, type: "text" }]
    : []
}

export { MessageAnimated, type MessageAnimatedMessage }
