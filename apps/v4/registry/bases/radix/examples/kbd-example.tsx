import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { ButtonGroup } from "@/registry/bases/radix/ui/button-group"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import { Kbd, KbdGroup } from "@/registry/bases/radix/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function KbdExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <KbdBasic />
        <KbdModifierKeys />
        <KbdGroupExample />
        <KbdArrowKeys />
        <KbdWithIcons />
        <KbdWithIconsAndText />
        <KbdInInputGroup />
        <KbdInTooltip />
        <KbdWithSamp />
      </div>
    </div>
  )
}

function KbdBasic() {
  return (
    <CanvaFrame title="Basic">
      <div className="flex items-center gap-2">
        <Kbd>Ctrl</Kbd>
        <Kbd>⌘K</Kbd>
        <Kbd>Ctrl + B</Kbd>
      </div>
    </CanvaFrame>
  )
}

function KbdModifierKeys() {
  return (
    <CanvaFrame title="Modifier Keys">
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>C</Kbd>
      </div>
    </CanvaFrame>
  )
}

function KbdGroupExample() {
  return (
    <CanvaFrame title="KbdGroup">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </CanvaFrame>
  )
}

function KbdArrowKeys() {
  return (
    <CanvaFrame title="Arrow Keys">
      <div className="flex items-center gap-2">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </div>
    </CanvaFrame>
  )
}

function KbdWithIcons() {
  return (
    <CanvaFrame title="With Icons">
      <KbdGroup>
        <Kbd>
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
        </Kbd>
        <Kbd>
          <IconArrowLeft />
        </Kbd>
        <Kbd>
          <IconArrowRight />
        </Kbd>
      </KbdGroup>
    </CanvaFrame>
  )
}

function KbdWithIconsAndText() {
  return (
    <CanvaFrame title="With Icons and Text">
      <KbdGroup>
        <Kbd>
          <IconArrowLeft />
          Left
        </Kbd>
        <Kbd>
          <IconPlaceholder
            lucide="CircleDashedIcon"
            tabler="IconCircleDashed"
            hugeicons="DashedLineCircleIcon"
          />
          Voice Enabled
        </Kbd>
      </KbdGroup>
    </CanvaFrame>
  )
}

function KbdInInputGroup() {
  return (
    <CanvaFrame title="InputGroup">
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </CanvaFrame>
  )
}

function KbdInTooltip() {
  return (
    <CanvaFrame title="Tooltip">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="icon-sm" variant="outline">
            <IconPlaceholder
              lucide="SaveIcon"
              tabler="IconDeviceFloppy"
              hugeicons="FloppyDiskIcon"
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex items-center gap-2">
            Save Changes <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function KbdWithSamp() {
  return (
    <CanvaFrame title="With samp">
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </CanvaFrame>
  )
}
