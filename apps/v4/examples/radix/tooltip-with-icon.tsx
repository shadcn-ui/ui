import { Button } from "@/examples/radix/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"
import { InfoIcon } from "lucide-react"

export function TooltipWithIcon() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon">
          <InfoIcon />
          <span className="sr-only">Info</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Additional information</p>
      </TooltipContent>
    </Tooltip>
  )
}
