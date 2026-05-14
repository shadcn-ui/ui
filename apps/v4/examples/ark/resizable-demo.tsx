import {
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterRoot,
} from "@/examples/ark/ui/resizable"

export default function ResizableDemo() {
  return (
    <SplitterRoot
      panels={[{ id: "a" }, { id: "b" }]}
      className="max-w-sm rounded-lg border"
    >
      <SplitterPanel id="a">
        <div className="flex h-50 items-center justify-center p-6">
          <span className="font-semibold">One</span>
        </div>
      </SplitterPanel>
      <SplitterResizeTrigger id="a:b" withHandle />
      <SplitterPanel id="b">
        <SplitterRoot
          panels={[{ id: "c" }, { id: "d" }]}
          orientation="vertical"
        >
          <SplitterPanel id="c">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Two</span>
            </div>
          </SplitterPanel>
          <SplitterResizeTrigger id="c:d" withHandle />
          <SplitterPanel id="d">
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Three</span>
            </div>
          </SplitterPanel>
        </SplitterRoot>
      </SplitterPanel>
    </SplitterRoot>
  )
}
