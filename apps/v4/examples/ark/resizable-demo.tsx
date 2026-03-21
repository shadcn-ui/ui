import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/examples/ark/ui/resizable"

export default function ResizableDemo() {
  return (
    <ResizablePanelGroup
      panels={[{ id: "a" }, { id: "b" }]}
      className="max-w-sm rounded-lg border"
    >
      <ResizablePanel id="a">
        <div className="flex h-[200px] items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </ResizablePanel>
      <ResizableHandle id="a:b" withHandle />
      <ResizablePanel id="b">
        <ResizablePanelGroup
          panels={[{ id: "c" }, { id: "d" }]}
          orientation="vertical"
        >
          <ResizablePanel id="c">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </ResizablePanel>
          <ResizableHandle id="c:d" withHandle />
          <ResizablePanel id="d">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
