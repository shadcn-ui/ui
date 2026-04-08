import { Button } from "@/styles/react-aria-nova/ui/button"
import { ButtonGroup } from "@/styles/react-aria-nova/ui/button-group"
import { Kbd, KbdGroup } from "@/styles/react-aria-nova/ui/kbd"
import { Tooltip, TooltipTrigger } from "@/styles/react-aria-nova/ui/tooltip"

export default function KbdTooltip() {
  return (
    <div className="flex flex-wrap gap-4">
      <ButtonGroup>
        <TooltipTrigger>
          <Button variant="outline">Save</Button>
          <Tooltip>
            Save Changes <Kbd>S</Kbd>
          </Tooltip>
        </TooltipTrigger>
        <TooltipTrigger>
          <Button variant="outline">Print</Button>
          <Tooltip>
            Print Document{" "}
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </Tooltip>
        </TooltipTrigger>
      </ButtonGroup>
    </div>
  )
}
