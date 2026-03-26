import { Button } from "@/examples/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"

export function TooltipSides() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["left", "top", "bottom", "right"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="w-fit capitalize">
              {side}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={side}>
            <p>Add to library</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  )
}
