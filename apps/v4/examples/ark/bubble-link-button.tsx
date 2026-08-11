"use client"

import { toast } from "@/examples/ark/ui/toast"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/examples/ark/ui/bubble"

export function BubbleLinkButtonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button onClick={() => toast.create({ title: "You clicked forgot password" })}>
              I forgot my password
            </button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button onClick={() => toast.create({ title: "You clicked help with subscription" })}>
              I need help with my subscription
            </button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent asChild>
            <button
              onClick={() =>
                toast.create({ title: "You clicked something else. Talk to a human." })
              }
            >
              Something else. Talk to a human.
            </button>
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
