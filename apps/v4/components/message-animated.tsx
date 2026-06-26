"use client"

import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import type { MessageAnimationPreset } from "@/lib/message-animations"
import { MESSAGE_ANIMATIONS } from "@/lib/message-animations"
import { Bubble, BubbleContent } from "@/styles/radix-rhea/ui/bubble"
import { Message, MessageContent } from "@/styles/radix-rhea/ui/message"
import { MessageScrollerItem } from "@/styles/radix-rhea/ui/message-scroller"

type MessageAnimatedPart = {
  type: string
  text?: string
}

type MessageAnimatedMessage = {
  id: string
  role: string
  text?: string
  parts?: ReadonlyArray<MessageAnimatedPart>
}

type MessageAnimatedTextPart = {
  key: string
  text: string
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
  const textParts = getMessageAnimatedTextParts(message)

  return (
    <Message align={isUserMessage ? "end" : "start"}>
      <MessageContent>
        {textParts.map((part) => {
          const paragraphs = part.text
            .split(/\n\s*\n/)
            .map((paragraph) => paragraph.trim())
            .filter(Boolean)

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

function getMessageAnimatedTextParts(
  message: MessageAnimatedMessage
): MessageAnimatedTextPart[] {
  if (message.parts) {
    return message.parts.flatMap((part, index) => {
      if (part.type !== "text" || typeof part.text !== "string") {
        return []
      }

      return [{ key: `${message.id}-${index}`, text: part.text }]
    })
  }

  return typeof message.text === "string"
    ? [{ key: `${message.id}-text`, text: message.text }]
    : []
}

export { MessageAnimated, type MessageAnimatedMessage }
