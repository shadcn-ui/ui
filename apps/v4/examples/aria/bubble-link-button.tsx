"use client"

import { toast } from "sonner"

import {
  Bubble,
  BubbleContent,
  BubbleGroup,
} from "@/styles/aria-rhea/ui/bubble"

export function BubbleLinkButtonDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-8 py-12">
      <Bubble variant="muted">
        <BubbleContent>How can I help you today?</BubbleContent>
      </Bubble>
      <BubbleGroup>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={(props) => (
              <button
                onClick={() => toast("You clicked forgot password")}
                {...props}
              />
            )}
          >
            I forgot my password
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={(props) => (
              <button
                onClick={() => toast("You clicked help with subscription")}
                {...props}
              />
            )}
          >
            I need help with my subscription
          </BubbleContent>
        </Bubble>
        <Bubble variant="tinted" align="end">
          <BubbleContent
            render={(props) => (
              <button
                onClick={() =>
                  toast("You clicked something else. Talk to a human.")
                }
                {...props}
              />
            )}
          >
            Something else. Talk to a human.
          </BubbleContent>
        </Bubble>
      </BubbleGroup>
    </div>
  )
}
