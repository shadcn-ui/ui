import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { Button } from "@/registry/radix-nova/ui/button"
import { ButtonGroup } from "@/registry/radix-nova/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/radix-nova/ui/input-group"
import { Kbd, KbdGroup } from "@/registry/radix-nova/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/radix-nova/ui/tooltip"
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function KbdDemo() {
  return (
    <div className="flex max-w-xs flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <Kbd>Ctrl</Kbd>
        <Kbd>⌘K</Kbd>
        <Kbd>Ctrl + B</Kbd>
      </div>
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>C</Kbd>
      </div>
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
      <div className="flex items-center gap-2">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </div>
      <KbdGroup>
        <Kbd>
          <IconPlaceholder name="KbdCommand" />
        </Kbd>
        <Kbd>
          <IconArrowLeft />
        </Kbd>
        <Kbd>
          <IconArrowRight />
        </Kbd>
      </KbdGroup>
      <KbdGroup>
        <Kbd>
          <IconArrowLeft />
          Left
        </Kbd>
        <Kbd>
          <IconPlaceholder name="KbdVoice" />
          Voice Enabled
        </Kbd>
      </KbdGroup>
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
      <ButtonGroup>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Save Changes <Kbd>S</Kbd>
            </div>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="sm" variant="outline">
              Print
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              Print Document{" "}
              <KbdGroup>
                <Kbd>Ctrl</Kbd>
                <Kbd>P</Kbd>
              </KbdGroup>
            </div>
          </TooltipContent>
        </Tooltip>
      </ButtonGroup>
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </div>
  )
}
