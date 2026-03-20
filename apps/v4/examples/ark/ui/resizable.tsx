"use client"

import * as React from "react"
import { ark } from "@ark-ui/react/factory"
import { Splitter } from "@ark-ui/react/splitter"

import { cn } from "@/examples/ark/lib/utils"

type PanelConfig = { id: string; size?: number }

const ResizableContext = React.createContext<{
  panelIds: string[]
  handleIds: string[]
  nextPanel: () => string
  nextHandle: () => string
}>({
  panelIds: [],
  handleIds: [],
  nextPanel: () => "p0",
  nextHandle: () => "p0:p1",
})

function buildConfig(children: React.ReactNode): {
  panels: PanelConfig[]
  handleIds: string[]
} {
  const panels: PanelConfig[] = []
  const handleIds: string[] = []
  const order: ("panel" | "handle")[] = []

  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    const name = (child.type as { displayName?: string })?.displayName
    if (name === "ResizablePanel") {
      const props = child.props as Record<string, unknown>
      const id = `p${panels.length}`
      const raw = props.defaultSize
      let size: number | undefined
      if (typeof raw === "string") size = parseFloat(raw)
      else if (typeof raw === "number") size = raw
      panels.push({ id, size })
      order.push("panel")
    } else if (name === "ResizableHandle") {
      order.push("handle")
    }
  })

  let panelIdx = 0
  for (const type of order) {
    if (type === "panel") {
      panelIdx++
    } else {
      const left = panels[panelIdx - 1]?.id ?? `p${panelIdx - 1}`
      const right = panels[panelIdx]?.id ?? `p${panelIdx}`
      handleIds.push(`${left}:${right}`)
    }
  }

  return { panels, handleIds }
}

function ResizablePanelGroup({
  className,
  children,
  direction,
  orientation,
  ...props
}: Omit<React.ComponentProps<typeof Splitter.Root>, "panels"> & {
  direction?: "horizontal" | "vertical"
}) {
  const config = React.useMemo(() => buildConfig(children), [children])

  const arkPanels = React.useMemo(
    () => config.panels.map(({ id }) => ({ id })),
    [config.panels]
  )

  const defaultSize = React.useMemo(() => {
    const sizes = config.panels
      .map((p) => p.size)
      .filter((s): s is number => s != null)
    return sizes.length > 0 ? sizes : undefined
  }, [config.panels])

  const panelCounter = React.useRef(0)
  const handleCounter = React.useRef(0)

  // Reset counters each render so children get sequential IDs
  panelCounter.current = 0
  handleCounter.current = 0

  const ctx = React.useMemo(
    () => ({
      panelIds: config.panels.map((p) => p.id),
      handleIds: config.handleIds,
      nextPanel: () => {
        const idx = panelCounter.current++
        return config.panels[idx]?.id ?? `p${idx}`
      },
      nextHandle: () => {
        const idx = handleCounter.current++
        return config.handleIds[idx] ?? `p${idx}:p${idx + 1}`
      },
    }),
    [config]
  )

  return (
    <ResizableContext.Provider value={ctx}>
      <Splitter.Root
        data-slot="resizable-panel-group"
        panels={arkPanels}
        defaultSize={defaultSize}
        orientation={orientation ?? direction ?? "horizontal"}
        className={cn(
          "flex h-full w-full data-[orientation=vertical]:flex-col",
          className
        )}
        {...props}
      >
        {children}
      </Splitter.Root>
    </ResizableContext.Provider>
  )
}

function ResizablePanel({
  className,
  defaultSize: _defaultSize,
  ...props
}: Omit<React.ComponentProps<typeof Splitter.Panel>, "id"> & {
  defaultSize?: string | number
}) {
  const { nextPanel } = React.useContext(ResizableContext)
  const [id] = React.useState(nextPanel)

  return (
    <Splitter.Panel
      data-slot="resizable-panel"
      id={id}
      className={className}
      {...props}
    />
  )
}
ResizablePanel.displayName = "ResizablePanel"

function ResizableHandle({
  withHandle,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Splitter.ResizeTrigger>, "id"> & {
  withHandle?: boolean
}) {
  const { nextHandle } = React.useContext(ResizableContext)
  const [id] = React.useState(nextHandle)

  return (
    <Splitter.ResizeTrigger
      data-slot="resizable-handle"
      id={id}
      className={cn(
        "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:after:left-0 data-[orientation=horizontal]:after:h-1 data-[orientation=horizontal]:after:w-full data-[orientation=horizontal]:after:translate-x-0 data-[orientation=horizontal]:after:-translate-y-1/2 [&[data-orientation=horizontal]>div]:rotate-90",
        className
      )}
      {...props}
    >
      {withHandle && (
        <Splitter.ResizeTriggerIndicator>
          <ark.div className="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border" />
        </Splitter.ResizeTriggerIndicator>
      )}
    </Splitter.ResizeTrigger>
  )
}
ResizableHandle.displayName = "ResizableHandle"

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
