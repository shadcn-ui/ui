"use client"

import { Link } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import { Kbd } from "@/registry/bases/aria/ui/kbd"
import { Tooltip, TooltipTrigger } from "@/registry/bases/aria/ui/tooltip"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function TooltipExample() {
  return (
    <ExampleWrapper>
      <TooltipBasic />
      <TooltipSides />
      <TooltipWithIcon />
      <TooltipLongContent />
      <TooltipDisabled />
      <TooltipWithKeyboard />
      <TooltipOnLink />
      <TooltipFormatted />
    </ExampleWrapper>
  )
}

function TooltipBasic() {
  return (
    <Example title="Basic">
      <TooltipTrigger>
        <Button variant="outline" className="w-fit">
          Show Tooltip
        </Button>
        <Tooltip>
          <p>Add to library</p>
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}

function TooltipSides() {
  return (
    <Example title="Sides">
      <div className="flex flex-wrap gap-2">
        {(["start", "left", "top", "bottom", "right", "end"] as const).map(
          (placement) => (
            <TooltipTrigger key={placement}>
              <Button variant="outline" className="w-fit capitalize">
                {placement}
              </Button>
              <Tooltip placement={placement}>
                <p>Add to library</p>
              </Tooltip>
            </TooltipTrigger>
          )
        )}
      </div>
    </Example>
  )
}

function TooltipWithIcon() {
  return (
    <Example title="With Icon">
      <TooltipTrigger>
        <Button variant="ghost" size="icon">
          <IconPlaceholder
            lucide="InfoIcon"
            tabler="IconInfoCircle"
            hugeicons="AlertCircleIcon"
            phosphor="InfoIcon"
            remixicon="RiInformationLine"
          />
          <span className="sr-only">Info</span>
        </Button>
        <Tooltip>
          <p>Additional information</p>
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}

function TooltipLongContent() {
  return (
    <Example title="Long Content">
      <TooltipTrigger>
        <Button variant="outline" className="w-fit">
          Show Tooltip
        </Button>
        <Tooltip>
          To learn more about how this works, check out the docs. If you have
          any questions, please reach out to us.
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}

function TooltipDisabled() {
  return (
    <Example title="Disabled">
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
    </Example>
  )
}

function TooltipWithKeyboard() {
  return (
    <Example title="With Keyboard Shortcut">
      <TooltipTrigger>
        <Button variant="outline" size="icon-sm">
          <IconPlaceholder
            lucide="SaveIcon"
            tabler="IconDeviceFloppy"
            hugeicons="FloppyDiskIcon"
            phosphor="FloppyDiskIcon"
            remixicon="RiSaveLine"
          />
        </Button>
        <Tooltip>
          Save Changes <Kbd>S</Kbd>
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}

function TooltipOnLink() {
  return (
    <Example title="On Link">
      <TooltipTrigger>
        <Link
          href="#"
          className="w-fit text-sm text-primary underline-offset-4 hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Learn more
        </Link>
        <Tooltip>
          <p>Click to read the documentation</p>
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}

function TooltipFormatted() {
  return (
    <Example title="Formatted Content">
      <TooltipTrigger>
        <Button variant="outline" className="w-fit">
          Status
        </Button>
        <Tooltip>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Active</p>
            <p className="text-xs opacity-80">Last updated 2 hours ago</p>
          </div>
        </Tooltip>
      </TooltipTrigger>
    </Example>
  )
}
