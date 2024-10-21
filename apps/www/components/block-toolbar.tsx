"use client"

import * as React from "react"
import Link from "next/link"
import {
  Check,
  Fullscreen,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
} from "lucide-react"
import { ImperativePanelHandle } from "react-resizable-panels"

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard"
import { V0Button } from "@/components/v0-button"
import { Button } from "@/registry/new-york/ui/button"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group"
import { Block } from "@/registry/schema"

export function BlockToolbar({
  block,
  resizablePanelRef,
}: {
  block: Pick<Block, "name" | "style" | "description" | "container">
  resizablePanelRef: React.RefObject<ImperativePanelHandle>
}) {
  const { copyToClipboard, isCopied } = useCopyToClipboard()

  return (
    <div className="flex items-center gap-2 md:gap-4">
      <Button asChild variant="link" className="whitespace-normal px-1 md:px-2">
        <a href={`#${block.name}`}>{block.description}</a>
      </Button>
      <div className="ml-auto hidden items-center gap-2 md:flex md:pr-[14px]">
        <Button
          variant="ghost"
          className="h-7 rounded-md border bg-muted shadow-none"
          size="sm"
          onClick={() => {
            copyToClipboard(`npx shadcn@latest add ${block.name}`)
          }}
        >
          {isCopied ? <Check /> : <Terminal />}
          npx shadcn add {block.name}
        </Button>
        <Separator orientation="vertical" className="mx-2 hidden h-4 md:flex" />
        <div className="hidden h-7 items-center gap-1.5 rounded-md border p-[2px] shadow-none md:flex">
          <ToggleGroup
            type="single"
            defaultValue="100"
            onValueChange={(value) => {
              if (resizablePanelRef.current) {
                resizablePanelRef.current.resize(parseInt(value))
              }
            }}
          >
            <ToggleGroupItem
              value="100"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Desktop"
            >
              <Monitor className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="60"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Tablet"
            >
              <Tablet className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem
              value="30"
              className="h-[22px] w-[22px] rounded-sm p-0"
              title="Mobile"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <Separator orientation="vertical" className="h-4" />
            <Button
              size="icon"
              variant="ghost"
              className="h-[22px] w-[22px] rounded-sm p-0"
              asChild
              title="Open in New Tab"
            >
              <Link
                href={`/blocks/${block.style}/${block.name}`}
                target="_blank"
              >
                <span className="sr-only">Open in New Tab</span>
                <Fullscreen className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </ToggleGroup>
        </div>
        <Separator orientation="vertical" className="mx-2 hidden h-4 md:flex" />
        <V0Button
          className="hidden shadow-none md:flex"
          id={`v0-button-${block.name}`}
          name={`v0-${block.name}`}
        />
      </div>
    </div>
  )
}
