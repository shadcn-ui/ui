"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import {
  SplitterResizeTrigger,
  SplitterPanel,
  SplitterRoot,
} from "@/registry/bases/ark/ui/resizable"

export default function ResizableExample() {
  return (
    <ExampleWrapper>
      <ResizableHorizontal />
      <ResizableVertical />
      <ResizableWithHandle />
      <ResizableNested />
      <ResizableControlled />
    </ExampleWrapper>
  )
}

function ResizableHorizontal() {
  return (
    <Example title="Horizontal">
      <SplitterRoot
        panels={[{ id: "a" }, { id: "b" }]}
        className="min-h-[200px] rounded-lg border"
      >
        <SplitterPanel id="a">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b" />
        <SplitterPanel id="b">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </SplitterPanel>
      </SplitterRoot>
    </Example>
  )
}

function ResizableVertical() {
  return (
    <Example title="Vertical">
      <SplitterRoot
        panels={[{ id: "a" }, { id: "b" }]}
        orientation="vertical"
        className="min-h-[200px] rounded-lg border"
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
    </Example>
  )
}

function ResizableWithHandle() {
  return (
    <Example title="With Handle">
      <SplitterRoot
        panels={[{ id: "a" }, { id: "b" }]}
        className="min-h-[200px] rounded-lg border"
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
    </Example>
  )
}

function ResizableNested() {
  return (
    <Example title="Nested">
      <SplitterRoot
        panels={[{ id: "a" }, { id: "b" }]}
        className="rounded-lg border"
      >
        <SplitterPanel id="a">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </SplitterPanel>
        <SplitterResizeTrigger id="a:b" />
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
            <SplitterResizeTrigger id="c:d" />
            <SplitterPanel id="d">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </SplitterPanel>
          </SplitterRoot>
        </SplitterPanel>
      </SplitterRoot>
    </Example>
  )
}

function ResizableControlled() {
  const [sizes, setSizes] = React.useState<number[]>([30, 70])

  return (
    <Example title="Controlled">
      <SplitterRoot
        panels={[{ id: "left", minSize: 20 }, { id: "right", minSize: 30 }]}
        defaultSize={[30, 70]}
        className="min-h-[200px] rounded-lg border"
        onResize={(details) => setSizes(details.size)}
      >
        <SplitterPanel id="left">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(sizes[0])}%
            </span>
          </div>
        </SplitterPanel>
        <SplitterResizeTrigger id="left:right" />
        <SplitterPanel id="right">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(sizes[1])}%
            </span>
          </div>
        </SplitterPanel>
      </SplitterRoot>
    </Example>
  )
}
