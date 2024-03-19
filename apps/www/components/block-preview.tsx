import { getBlock } from "@/lib/blocks"
import { highlightCode } from "@/lib/highlight-code"
import { BlockCopyCodeButton } from "@/components/block-copy-code-button"
import { V0Button } from "@/components/v0-button"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/new-york/ui/resizable"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs"

export async function BlockPreview({ name }: { name: string }) {
  const block = await getBlock(name)

  if (!block) {
    return null
  }

  const highlightedCode = block.code ? await highlightCode(block.code) : ""

  return (
    <Tabs defaultValue="preview" className="relative grid w-full gap-4">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        {block.code && (
          <div className="ml-auto flex items-center gap-2 pr-[14px]">
            <BlockCopyCodeButton name={block.name} code={block.code} />
            <V0Button
              name={block.name}
              description={block.description || "Edit in v0"}
              code={block.code}
            />
          </div>
        )}
      </div>
      <TabsContent value="preview">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            className="rounded-md border"
            defaultSize={100}
            minSize={35}
          >
            <iframe
              src={`/blocks/${block.name}`}
              height={block.container?.height}
              className="w-full"
            />
          </ResizablePanel>
          <ResizableHandle className="relative w-3 bg-transparent p-0 after:absolute after:right-0 after:top-1/2 after:h-8 after:w-[6px] after:-translate-y-1/2 after:translate-x-[-1px] after:rounded-full after:bg-border after:transition-all after:hover:h-10" />
          <ResizablePanel defaultSize={0} minSize={0} />
        </ResizablePanelGroup>
      </TabsContent>
      <TabsContent value="code">
        <div
          data-rehype-pretty-code-fragment
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className="w-full overflow-hidden rounded-md [&_pre]:my-0 [&_pre]:max-h-[450px] [&_pre]:overflow-auto [&_pre]:whitespace-break-spaces [&_pre]:p-6 [&_pre]:font-mono [&_pre]:text-sm [&_pre]:leading-relaxed"
        />
      </TabsContent>
    </Tabs>
  )
}
