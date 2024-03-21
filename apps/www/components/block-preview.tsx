"use client"

import * as React from "react"
import {
  CircleHelp,
  Info,
  Monitor,
  Phone,
  Smartphone,
  Tablet,
} from "lucide-react"
import { ImperativePanelHandle } from "react-resizable-panels"

import { useConfig } from "@/hooks/use-config"
import { BlockCopyCodeButton } from "@/components/block-copy-code-button"
import { Icons } from "@/components/icons"
import { StyleSwitcher } from "@/components/style-switcher"
import { V0Button } from "@/components/v0-button"
import { Badge } from "@/registry/new-york/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york/ui/popover"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable"
import { Separator } from "@/registry/new-york/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/new-york/ui/toggle-group"
import { Block } from "@/registry/schema"

export function BlockPreview({ block }: { block: Block }) {
  const [config] = useConfig()
  const [isLoading, setIsLoading] = React.useState(true)
  const ref = React.useRef<ImperativePanelHandle>(null)

  if (config.style !== block.style) {
    return null
  }

  return (
    <Tabs
      id={block.name}
      defaultValue="preview"
      className="relative grid w-full scroll-m-20 gap-4"
      style={
        {
          "--container-height": block.container?.height,
        } as React.CSSProperties
      }
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <TabsList className="hidden sm:flex">
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
          </TabsList>
          <div className="hidden items-center gap-2 sm:flex">
            <Separator
              orientation="vertical"
              className="mx-2 hidden h-4 md:flex"
            />
            <div className="flex items-center gap-2">
              <a href={`#${block.name}`}>
                <Badge variant="outline">{block.name}</Badge>
              </a>
              <Popover>
                <PopoverTrigger className="hidden text-muted-foreground hover:text-foreground sm:flex">
                  <Info className="h-3.5 w-3.5" />
                  <span className="sr-only">Block description</span>
                </PopoverTrigger>
                <PopoverContent
                  side="right"
                  sideOffset={10}
                  className="text-sm"
                >
                  {block.description}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        {block.code && (
          <div className="flex items-center gap-2 pr-[14px] sm:ml-auto">
            <div className="hidden h-[28px] items-center gap-1.5 rounded-md border p-[2px] shadow-sm md:flex">
              <ToggleGroup
                type="single"
                defaultValue="100"
                onValueChange={(value) => {
                  if (ref.current) {
                    ref.current.resize(parseInt(value))
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
                  value="25"
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
            <StyleSwitcher className="h-7" />
            <Popover>
              <PopoverTrigger className="hidden text-muted-foreground hover:text-foreground sm:flex">
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
                  A style comes with its own set of components, animations,
                  icons and more.
                </p>
                <p>
                  The <span className="font-medium">Default</span> style has
                  larger inputs, uses lucide-react for icons and
                  tailwindcss-animate for animations.
                </p>
                <p>
                  The <span className="font-medium">New York</span> style ships
                  with smaller buttons and inputs. It also uses shadows on cards
                  and buttons.
                </p>
              </PopoverContent>
            </Popover>
            <Separator orientation="vertical" className="mx-2 h-4" />
            <BlockCopyCodeButton name={block.name} code={block.code} />
            <V0Button
              name={block.name}
              description={block.description || "Edit in v0"}
              code={block.code}
              style={block.style}
            />
          </div>
        )}
      </div>
      <TabsContent
        value="preview"
        className="relative after:absolute after:inset-0 after:right-3 after:z-0 after:rounded-lg after:bg-muted"
      >
        <ResizablePanelGroup direction="horizontal" className="relative z-10">
          <ResizablePanel
            ref={ref}
            className="relative rounded-lg border bg-background transition-all"
            defaultSize={100}
            minSize={25}
          >
            {isLoading ? (
              <div className="absolute inset-0 z-10 flex h-[--container-height] w-full items-center justify-center gap-2 text-sm text-muted-foreground">
                <Icons.spinner className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : null}
            <iframe
              src={`/blocks/${block.style}/${block.name}`}
              height={block.container?.height}
              className="relative z-20 w-full bg-background"
              onLoad={() => {
                setIsLoading(false)
              }}
            />
          </ResizablePanel>
          <ResizableHandle className="relative hidden w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10 sm:block" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </TabsContent>
      <TabsContent value="code">
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: block.highlightedCode }}
          className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:h-[--container-height] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </TabsContent>
    </Tabs>
  )
}
