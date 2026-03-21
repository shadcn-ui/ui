import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/ark/ui/resizable"

export default function ResizableHandleDemo() {
  return (
    <ResizablePanelGroup
      panels={[{ id: "a" }, { id: "b" }]}
      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
      <ResizablePanel id="a">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </ResizablePanel>
      <ResizableHandle id="a:b" withHandle />
      <ResizablePanel id="b">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
