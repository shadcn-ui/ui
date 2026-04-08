import { Button } from "@/styles/react-aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

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
