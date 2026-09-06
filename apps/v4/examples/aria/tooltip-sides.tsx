import { Button } from "@/styles/aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui/tooltip"

export function TooltipSides() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["left", "top", "bottom", "right"] as const).map((side) => (
        <TooltipTrigger key={side}>
          <Button variant="outline" className="w-fit capitalize">
            {side}
          </Button>
          <Tooltip placement={side}>
            <p>Add to library</p>
          </Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  )
}
