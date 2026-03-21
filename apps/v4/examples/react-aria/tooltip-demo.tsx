import { Button } from "@/examples/react-aria/ui/button"
import { Tooltip, TooltipTrigger } from "@/examples/react-aria/ui/tooltip"

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
