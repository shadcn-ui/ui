import {
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterRoot,
} from "@/examples/ark/ui/resizable"

export function ResizableVertical() {
  return (
    <SplitterRoot
      panels={[{ id: "a" }, { id: "b" }]}
      orientation="vertical"
      className="min-h-[200px] max-w-sm rounded-lg border"
    >
      <SplitterPanel id="a">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Header</span>
        </div>
      </SplitterPanel>
      <SplitterResizeTrigger id="a:b" />
      <SplitterPanel id="b">
        <div className="flex h-full items-center justify-center p-6">
          <span className="font-semibold">Content</span>
        </div>
      </SplitterPanel>
    </SplitterRoot>
  )
}
