import * as React from "react"
import { type TextUIPart } from "ai"

import { Markdown } from "@/components/markdown"
import { Bubble, BubbleContent } from "@/registry/bases/radix/ui/bubble"

type PartTextVariant = "default" | "bubble"

export function PartText({
  part,
  role,
  variant,
  tinted = false,
  className,
  ...props
}: {
  part: TextUIPart
  role?: "user" | "system" | "assistant"
  tinted?: boolean
  variant?: PartTextVariant
} & Omit<
  React.ComponentProps<typeof Bubble>,
  "children" | "part" | "variant"
>) {
  if (part.type !== "text") {
    return null
  }

  const content =
    role === "user" || variant === "bubble" ? (
      part.text
    ) : (
      <Markdown animated>{part.text}</Markdown>
    )
  const bubbleVariant =
    variant === "bubble"
      ? tinted
        ? "tinted"
        : "default"
      : role === "user"
        ? "default"
        : "ghost"

  return (
    <Bubble variant={bubbleVariant} className={className} {...props}>
      <BubbleContent>{content}</BubbleContent>
    </Bubble>
  )
}
