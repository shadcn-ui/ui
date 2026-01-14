import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/radix/ui/resizable"

export function ResizableWithHandle() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] rounded-lg border"
    >
      <ResizablePanel defaultSize={25}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={75}>
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
