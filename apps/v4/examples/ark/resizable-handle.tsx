import {
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterRoot,
} from "@/examples/ark/ui/resizable"

export default function ResizableHandleDemo() {
  return (
    <SplitterRoot
      panels={[{ id: "a" }, { id: "b" }]}
      className="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
    >
      <SplitterPanel id="a">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Sidebar</span>
        </div>
      </SplitterPanel>
      <SplitterResizeTrigger id="a:b" withHandle />
      <SplitterPanel id="b">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </SplitterPanel>
    </SplitterRoot>
  )
}
