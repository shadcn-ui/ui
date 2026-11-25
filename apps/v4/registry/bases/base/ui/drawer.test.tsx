// @vitest-environment jsdom

import { act, createElement } from "react"
import { createRoot, type Root } from "react-dom/client"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Drawer, DrawerOverlay, DrawerPortal } from "./drawer"

describe("DrawerOverlay", () => {
  let container: HTMLDivElement
  let root: Root

  beforeEach(() => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true)
    container = document.createElement("div")
    document.body.append(container)
    root = createRoot(container)
  })

  afterEach(() => {
    act(() => root.unmount())
    container.remove()
    vi.unstubAllGlobals()
  })

  it("covers the scrolled viewport on iOS Safari", () => {
    vi.stubGlobal("scrollY", 640)

    act(() =>
      root.render(
        createElement(
          Drawer,
          { open: true },
          createElement(DrawerPortal, null, createElement(DrawerOverlay))
        )
      )
    )

    const overlay = document.body.querySelector<HTMLElement>(
      '[data-slot="drawer-overlay"]'
    )

    expect(overlay?.style.getPropertyValue("--drawer-overlay-top")).toBe(
      "640px"
    )
    expect(overlay?.className).toContain(
      "supports-[-webkit-touch-callout:none]:absolute"
    )
    expect(overlay?.className).toContain(
      "supports-[-webkit-touch-callout:none]:top-[calc(var(--drawer-overlay-top)-100px)]"
    )
    expect(overlay?.className).toContain(
      "supports-[-webkit-touch-callout:none]:h-[calc(100lvh+200px)]"
    )
  })
})
