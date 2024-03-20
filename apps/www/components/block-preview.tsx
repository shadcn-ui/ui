"use client"

import * as React from "react"

import { useConfig } from "@/hooks/use-config"
import { BlockCopyCodeButton } from "@/components/block-copy-code-button"
import { Icons } from "@/components/icons"
import { StyleSwitcher } from "@/components/style-switcher"
import { V0Button } from "@/components/v0-button"
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
import { Block } from "@/registry/schema"

export function BlockPreview({ block }: { block: Block }) {
  const [config] = useConfig()
  const [isLoading, setIsLoading] = React.useState(true)

  if (config.style !== block.style) {
    return null
  }

  return (
    <Tabs defaultValue="preview" className="relative grid w-full gap-4">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        {block.code && (
          <div className="ml-auto flex items-center gap-2 pr-[14px]">
            <StyleSwitcher className="h-7" />
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
      <TabsContent value="preview">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="relative rounded-md border bg-background"
            defaultSize={100}
            minSize={35}
          >
            {isLoading ? (
              <div
                className="absolute inset-0 z-10 flex h-full w-full items-center justify-center gap-2 text-sm text-muted-foreground"
                style={{
                  height: block.container?.height,
                }}
              >
                <Icons.spinner className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : null}
            <iframe
              src={`/blocks/${block.style}/${block.name}`}
              height={block.container?.height}
              className="relative z-20 w-full bg-background"
              onLoad={() => {
                console.log("done")
                setIsLoading(false)
              }}
            />
          </ResizablePanel>
          <ResizableHandle className="relative w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </TabsContent>
      <TabsContent value="code">
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: block.highlightedCode }}
          className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:max-h-[450px] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </TabsContent>
    </Tabs>
  )
}
