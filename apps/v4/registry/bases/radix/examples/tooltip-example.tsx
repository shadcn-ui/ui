"use client"

import { CanvaFrame } from "@/components/canva"
import { Button } from "@/registry/bases/radix/ui/button"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/bases/radix/ui/tooltip"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function TooltipExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <TooltipBasic />
        <TooltipSides />
        <TooltipWithIcon />
        <TooltipLongContent />
        <TooltipDisabled />
        <TooltipWithKeyboard />
        <TooltipOnLink />
        <TooltipFormatted />
      </div>
    </div>
  )
}

function TooltipBasic() {
  return (
    <CanvaFrame title="Basic">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-fit">
            Show Tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function TooltipSides() {
  return (
    <CanvaFrame title="Sides">
      <div className="flex flex-wrap gap-2">
        {(["top", "right", "bottom", "left"] as const).map((side) => (
          <Tooltip key={side}>
            <TooltipTrigger asChild>
              <Button variant="outline" className="w-fit capitalize">
                {side}
              </Button>
            </TooltipTrigger>
            <TooltipContent side={side}>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </CanvaFrame>
  )
}

function TooltipWithIcon() {
  return (
    <CanvaFrame title="With Icon">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon">
            <IconPlaceholder
              lucide="InfoIcon"
              tabler="IconInfoCircle"
              hugeicons="AlertCircleIcon"
            />
            <span className="sr-only">Info</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Additional information</p>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function TooltipLongContent() {
  return (
    <CanvaFrame title="Long Content">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-fit">
            Show Tooltip
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          To learn more about how this works, check out the docs. If you have
          any questions, please reach out to us.
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function TooltipDisabled() {
  return (
    <CanvaFrame title="Disabled">
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-block w-fit">
            <Button variant="outline" disabled>
              Disabled
            </Button>
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>This feature is currently unavailable</p>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function TooltipWithKeyboard() {
  return (
    <CanvaFrame title="With Keyboard Shortcut">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon-sm">
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

function TooltipOnLink() {
  return (
    <CanvaFrame title="On Link">
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="#"
            className="text-primary w-fit text-sm underline-offset-4 hover:underline"
            onClick={(e) => e.preventDefault()}
          >
            Learn more
          </a>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to read the documentation</p>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}

function TooltipFormatted() {
  return (
    <CanvaFrame title="Formatted Content">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" className="w-fit">
            Status
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Active</p>
            <p className="text-xs opacity-80">Last updated 2 hours ago</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </CanvaFrame>
  )
}
