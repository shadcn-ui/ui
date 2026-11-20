import { Button } from "@/styles/aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui/tooltip"

export function TooltipDemo() {
  return (
    <TooltipTrigger>
      <Button variant="outline">Hover</Button>
      <Tooltip>
        <p>Add to library</p>
      </Tooltip>
    </TooltipTrigger>
  )
}
