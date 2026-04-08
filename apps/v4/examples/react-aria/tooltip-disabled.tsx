import { Button } from "@/styles/react-aria-nova/ui/button"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

export function TooltipDisabled() {
  return (
    <>
      <TooltipTrigger>
        <span className="inline-block w-fit">
          <Button variant="outline" isDisabled>
            Disabled
          </Button>
        </span>
        <Tooltip>
          <p>This feature is currently unavailable</p>
        </Tooltip>
      </TooltipTrigger>
    </>
  )
}
