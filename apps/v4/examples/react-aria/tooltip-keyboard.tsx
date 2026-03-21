import { Button } from "@/examples/react-aria/ui/button"
import { Kbd } from "@/examples/react-aria/ui/kbd"
import { Tooltip, TooltipTrigger } from "@/examples/react-aria/ui/tooltip"
import { SaveIcon } from "lucide-react"

export function TooltipKeyboard() {
  return (
    <TooltipTrigger>
      <Button variant="outline" size="icon-sm">
        <SaveIcon />
      </Button>
      <Tooltip>
        Save Changes <Kbd>S</Kbd>
      </Tooltip>
    </TooltipTrigger>
  )
}
