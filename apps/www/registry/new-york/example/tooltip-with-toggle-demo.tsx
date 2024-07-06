import { Heart } from "lucide-react"

import { Toggle } from "@/registry/new-york/ui/toggle"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"

export default function TooltipWithToggleDemo() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Toggle variant="outline" aria-label="Toggle Heart">
            <Heart className="h-4 w-4"/>
          </Toggle>
        </TooltipTrigger>
        <TooltipContent><p>Heart</p></TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
