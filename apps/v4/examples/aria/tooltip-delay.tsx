import { Button } from "@/styles/aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/aria-nova/ui/tooltip"

export function TooltipDelay() {
  return (
    <TooltipTrigger delay={200}>
      <Button variant="outline">Hover</Button>
      <Tooltip>
        <p>This tooltip has a 200ms delay.</p>
      </Tooltip>
    </TooltipTrigger>
  )
}
