"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/ark-vega/components/example"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/ark-vega/ui/resizable"

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
      <ResizablePanelGroup
        panels={[{ id: "a" }, { id: "b" }]}
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel id="a">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle id="a:b" />
        <ResizablePanel id="b">
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  )
}

function ResizableVertical() {
  return (
    <Example title="Vertical">
      <ResizablePanelGroup
        panels={[{ id: "a" }, { id: "b" }]}
        orientation="vertical"
        className="min-h-[200px] rounded-lg border"
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
    </Example>
  )
}

function ResizableWithHandle() {
  return (
    <Example title="With Handle">
      <ResizablePanelGroup
        panels={[{ id: "a" }, { id: "b" }]}
        className="min-h-[200px] rounded-lg border"
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
    </Example>
  )
}

function ResizableNested() {
  return (
    <Example title="Nested">
      <ResizablePanelGroup
        panels={[{ id: "a" }, { id: "b" }]}
        className="rounded-lg border"
      >
        <ResizablePanel id="a">
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle id="a:b" />
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
            <ResizableHandle id="c:d" />
            <ResizablePanel id="d">
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  )
}

function ResizableControlled() {
  const [sizes, setSizes] = React.useState<number[]>([30, 70])

  return (
    <Example title="Controlled">
      <ResizablePanelGroup
        panels={[{ id: "left", minSize: 20 }, { id: "right", minSize: 30 }]}
        defaultSize={[30, 70]}
        className="min-h-[200px] rounded-lg border"
        onResize={(details) => setSizes(details.size)}
      >
        <ResizablePanel id="left">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(sizes[0])}%
            </span>
          </div>
        </ResizablePanel>
        <ResizableHandle id="left:right" />
        <ResizablePanel id="right">
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">
              {Math.round(sizes[1])}%
            </span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  )
}
