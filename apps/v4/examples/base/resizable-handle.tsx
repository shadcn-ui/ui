import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/base/ui/resizable"

export default function ResizableHandleDemo() {
  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-[200px] max-w-sm rounded-lg border"
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
