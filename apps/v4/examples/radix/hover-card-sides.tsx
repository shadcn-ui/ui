import { Button } from "@/examples/radix/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/examples/radix/ui/hover-card"

const HOVER_CARD_SIDES = ["top", "right", "bottom", "left"] as const

export function HoverCardSides() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {HOVER_CARD_SIDES.map((side) => (
        <HoverCard key={side} openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="capitalize">
              {side}
            </Button>
          </HoverCardTrigger>
          <HoverCardContent side={side} className="w-64">
            <div className="style-lyra:gap-1 style-nova:gap-1.5 style-vega:gap-2 style-maia:gap-2 style-mira:gap-1 flex flex-col">
              <h4 className="font-medium">Hover Card</h4>
              <p>This hover card appears on the {side} side of the trigger.</p>
            </div>
          </HoverCardContent>
        </HoverCard>
      ))}
    </div>
  )
}
