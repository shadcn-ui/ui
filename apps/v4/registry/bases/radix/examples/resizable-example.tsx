"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/registry/bases/radix/ui/resizable"

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
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
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
        direction="vertical"
        className="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel defaultSize={25}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Header</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
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
    </Example>
  )
}

function ResizableNested() {
  return (
    <Example title="Nested">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="flex h-[200px] items-center justify-center p-6">
            <span className="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <div className="flex h-full items-center justify-center p-6">
                <span className="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
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
  const [sizes, setSizes] = React.useState([30, 70])

  return (
    <Example title="Controlled">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-[200px] rounded-lg border"
        onLayout={(newSizes) => {
          setSizes(newSizes)
        }}
      >
        <ResizablePanel defaultSize={30} minSize={20}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">{Math.round(sizes[0] ?? 30)}%</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70} minSize={30}>
          <div className="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span className="font-semibold">{Math.round(sizes[1] ?? 70)}%</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  )
}
