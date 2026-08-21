"use client"

import { Button } from "@/styles/aria-nova/ui/button"
import { HoverCard, HoverCardTrigger } from "@/styles/aria-nova/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <HoverCardTrigger delay={10} closeDelay={100}>
      <Button variant="link">Hover Here</Button>
      <HoverCard className="flex w-64 flex-col gap-0.5">
        <div className="font-semibold">@nextjs</div>
        <div>The React Framework – created and maintained by @vercel.</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Joined December 2021
        </div>
      </HoverCard>
    </HoverCardTrigger>
  )
}
