import { Button } from "@/styles/ark-nova/ui/button"
import { Kbd } from "@/styles/ark-nova/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/styles/ark-nova/ui/tooltip"
import { SaveIcon } from "lucide-react"

export function TooltipKeyboard() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon-sm">
          <SaveIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  )
}
