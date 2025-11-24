import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react"

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
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function KbdExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="w-full">
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-12 lg:grid-cols-3">
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
    </div>
  )
}

function KbdBasic() {
  return (
    <Frame title="Basic">
      <div className="flex items-center gap-2">
        <Kbd>Ctrl</Kbd>
        <Kbd>⌘K</Kbd>
        <Kbd>Ctrl + B</Kbd>
      </div>
    </Frame>
  )
}

function KbdModifierKeys() {
  return (
    <Frame title="Modifier Keys">
      <div className="flex items-center gap-2">
        <Kbd>⌘</Kbd>
        <Kbd>C</Kbd>
      </div>
    </Frame>
  )
}

function KbdGroupExample() {
  return (
    <Frame title="KbdGroup">
      <KbdGroup>
        <Kbd>Ctrl</Kbd>
        <Kbd>Shift</Kbd>
        <Kbd>P</Kbd>
      </KbdGroup>
    </Frame>
  )
}

function KbdArrowKeys() {
  return (
    <Frame title="Arrow Keys">
      <div className="flex items-center gap-2">
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
        <Kbd>←</Kbd>
        <Kbd>→</Kbd>
      </div>
    </Frame>
  )
}

function KbdWithIcons() {
  return (
    <Frame title="With Icons">
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
    </Frame>
  )
}

function KbdWithIconsAndText() {
  return (
    <Frame title="With Icons and Text">
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
    </Frame>
  )
}

function KbdInInputGroup() {
  return (
    <Frame title="InputGroup">
      <InputGroup>
        <InputGroupInput />
        <InputGroupAddon>
          <Kbd>Space</Kbd>
        </InputGroupAddon>
      </InputGroup>
    </Frame>
  )
}

function KbdInTooltip() {
  return (
    <Frame title="Tooltip">
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
    </Frame>
  )
}

function KbdWithSamp() {
  return (
    <Frame title="With samp">
      <Kbd>
        <samp>File</samp>
      </Kbd>
    </Frame>
  )
}
