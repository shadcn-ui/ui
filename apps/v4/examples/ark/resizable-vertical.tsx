import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/ark/ui/resizable"

export function ResizableVertical() {
  return (
    <ResizablePanelGroup
      panels={[{ id: "a" }, { id: "b" }]}
      orientation="vertical"
      className="min-h-[200px] max-w-sm rounded-lg border"
    >
      <ResizablePanel id="a">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </ResizablePanel>
      <ResizableHandle id="a:b" />
      <ResizablePanel id="b">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
