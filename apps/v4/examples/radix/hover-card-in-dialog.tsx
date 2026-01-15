import { Button } from "@/examples/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/examples/radix/ui/dialog"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/examples/radix/ui/hover-card"

export function HoverCardInDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hover Card Example</DialogTitle>
          <DialogDescription>
            Hover over the button below to see the hover card.
          </DialogDescription>
        </DialogHeader>
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button variant="outline" className="w-fit">
              Hover me
            </Button>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="style-lyra:gap-1 style-nova:gap-1.5 style-vega:gap-2 style-maia:gap-2 style-mira:gap-1 flex flex-col">
              <h4 className="font-medium">Hover Card</h4>
              <p>
                This hover card appears inside a dialog. Hover over the button
                to see it.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </DialogContent>
    </Dialog>
  )
}
