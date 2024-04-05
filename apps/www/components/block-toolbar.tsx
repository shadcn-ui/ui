"use client"

import * as React from "react"
import { Blocks, CircleHelp, Monitor, Smartphone, Tablet } from "lucide-react"
import { ImperativePanelHandle } from "react-resizable-panels"

import { cn } from "@/lib/utils"
import { useLiftMode } from "@/hooks/use-lift-mode"
import { BlockCopyButton } from "@/components/block-copy-button"
import { StyleSwitcher } from "@/components/style-switcher"
import { V0Button } from "@/components/v0-button"
import { Badge } from "@/registry/new-york/ui/badge"
import { Button } from "@/registry/new-york/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import { Separator } from "@/registry/new-york/ui/separator"
import { TabsList, TabsTrigger } from "@/registry/new-york/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/registry/new-york/ui/tooltip"
import { Block } from "@/registry/schema"

export function BlockToolbar({
  block,
  resizablePanelRef,
}: {
  block: Block
  resizablePanelRef: React.RefObject<ImperativePanelHandle>
}) {
  const { isLiftMode, toggleLiftMode } = useLiftMode(block.name)

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="flex items-center gap-2">
        <TabsList className="hidden h-8 rounded-md p-0 px-[calc(theme(spacing.1)_-_2px)] py-[theme(spacing.1)] sm:flex">
          <TabsTrigger
            value="preview"
            className="h-7 rounded-sm"
            disabled={isLiftMode}
          >
            Preview
          </TabsTrigger>
          <TabsTrigger
            value="code"
            className="h-7 rounded-sm"
            disabled={isLiftMode}
          >
            Code
          </TabsTrigger>
        </TabsList>
        <Separator orientation="vertical" className="mx-2 hidden h-4 md:flex" />
        <StyleSwitcher className="h-7" disabled={isLiftMode} />
        <Popover>
          <PopoverTrigger
            disabled={isLiftMode}
            className="hidden text-muted-foreground hover:text-foreground disabled:opacity-50 sm:flex"
          >
            <CircleHelp className="h-3.5 w-3.5" />
            <span className="sr-only">Block description</span>
          </PopoverTrigger>
          <PopoverContent
            side="top"
            sideOffset={20}
            className="space-y-3 rounded-[0.5rem] text-sm"
          >
            <p className="font-medium">
              What is the difference between the New York and Default style?
            </p>
            <p>
              A style comes with its own set of components, animations, icons
              and more.
            </p>
            <p>
              The <span className="font-medium">Default</span> style has larger
              inputs, uses lucide-react for icons and tailwindcss-animate for
              animations.
            </p>
            <p>
              The <span className="font-medium">New York</span> style ships with
              smaller buttons and inputs. It also uses shadows on cards and
              buttons.
            </p>
          </PopoverContent>
        </Popover>
        <div className="hidden items-center gap-2 sm:flex">
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 md:flex"
          />
          <div className="flex items-center gap-2">
            <a href={`#${block.name}`}>
              <Badge
                variant="outline"
                className={cn(isLiftMode && "opacity-50")}
              >
                {block.name}
              </Badge>
            </a>
          </div>
        </div>
      </div>
      {block.code && (
        <div className="flex items-center gap-2 pr-[14px] sm:ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant={isLiftMode ? "default" : "outline"}
                className="h-7 w-7"
                onClick={() => {
                  resizablePanelRef?.current?.resize(100)
                  toggleLiftMode(block.name)
                }}
              >
                <Blocks className="h-3.5 w-3.5" />
                <span className="sr-only">Chunk mode</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Lift Mode</TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" className="mx-2 h-4" />
          <div className="hidden h-[28px] items-center gap-1.5 rounded-md border p-[2px] shadow-sm md:flex">
            <ToggleGroup
              disabled={isLiftMode}
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
              >
                <Monitor className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="60"
                className="h-[22px] w-[22px] rounded-sm p-0"
              >
                <Tablet className="h-3.5 w-3.5" />
              </ToggleGroupItem>
              <ToggleGroupItem
                value="30"
                className="h-[22px] w-[22px] rounded-sm p-0"
              >
                <Smartphone className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
          <Separator
            orientation="vertical"
            className="mx-2 hidden h-4 md:flex"
          />
          <BlockCopyButton
            event="copy_block_code"
            name={block.name}
            code={block.code}
            disabled={isLiftMode}
          />
          <V0Button
            id={`v0-button-${block.name}`}
            disabled={isLiftMode}
            block={{
              name: block.name,
              description: block.description || "Edit in v0",
              code: block.code,
              style: block.style,
            }}
          />
        </div>
      )}
    </div>
  )
}
