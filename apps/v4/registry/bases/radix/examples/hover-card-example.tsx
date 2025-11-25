import { Button } from "@/registry/bases/radix/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/registry/bases/radix/ui/hover-card"
import Frame from "@/app/(design)/design/components/frame"

export default function HoverCardExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <HoverCardSides />
      </div>
    </div>
  )
}

const HOVER_CARD_SIDES = ["top", "right", "bottom", "left"] as const

function HoverCardSides() {
  return (
    <Frame title="Sides">
      <div className="flex flex-wrap items-center justify-center gap-4">
        {HOVER_CARD_SIDES.map((side) => (
          <HoverCard key={side} openDelay={100} closeDelay={100}>
            <HoverCardTrigger asChild>
              <Button variant="outline" className="capitalize">
                {side}
              </Button>
            </HoverCardTrigger>
            <HoverCardContent side={side} className="w-64">
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-semibold">Hover Card</h4>
                <p className="text-sm">
                  This hover card appears on the {side} side of the trigger.
                </p>
              </div>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </Frame>
  )
}
