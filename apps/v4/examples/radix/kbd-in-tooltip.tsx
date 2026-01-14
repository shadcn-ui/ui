import { Button } from "@/examples/radix/ui/button"
import { Kbd } from "@/examples/radix/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/examples/radix/ui/tooltip"
import { SaveIcon } from "lucide-react"

export function KbdInTooltip() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button size="icon-sm" variant="outline">
          <SaveIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="pr-1.5">
        <div className="flex items-center gap-2">
          Save Changes <Kbd>S</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
