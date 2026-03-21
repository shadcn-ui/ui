import { Button } from "@/examples/react-aria/ui/button"
import { Tooltip, TooltipTrigger } from "@/examples/react-aria/ui/tooltip"

export function TooltipSides() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["left", "top", "bottom", "right"] as const).map((side) => (
        <TooltipTrigger key={side}>
          <Button variant="outline" className="w-fit capitalize">
            {side}
          </Button>
          <Tooltip side={side}>
            <p>Add to library</p>
          </Tooltip>
        </TooltipTrigger>
      ))}
    </div>
  )
}
