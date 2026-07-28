// @vitest-environment jsdom

import * as React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  FileTreeItem,
  FileTreeItemLabel,
  type FileTreeNode,
} from "./bases/base/ui/file-tree"
import {
  VirtualizedFileTree,
  type VirtualizedFileTreeHandle,
} from "./bases/base/ui/file-tree-virtualized"

class TestResizeObserver implements ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {}

  disconnect() {}
  observe(_target: Element) {}
  unobserve() {}
}

const items: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "alpha", name: "alpha.ts", type: "file" },
      { id: "beta", name: "beta.ts", type: "file" },
    ],
  },
  { id: "readme", name: "README.md", type: "file" },
]

const renderItem = () => (
  <FileTreeItem>
    <FileTreeItemLabel />
  </FileTreeItem>
)

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", TestResizeObserver)
  Object.defineProperty(HTMLElement.prototype, "clientHeight", {
    configurable: true,
    get: () => 96,
  })
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get: () => 96,
  })
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get: () => 320,
  })
  Object.defineProperty(HTMLElement.prototype, "scrollTo", {
    configurable: true,
    value(options: ScrollToOptions | number, y?: number) {
      const top = typeof options === "number" ? (y ?? 0) : (options.top ?? 0)
      this.scrollTop = top
      this.dispatchEvent(new Event("scroll"))
    },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function getRow(name: string) {
  const row = screen.getByText(name).closest<HTMLElement>('[role="treeitem"]')
  if (!row) throw new Error(`Missing row for ${name}`)
  return row
}

describe("VirtualizedFileTree", () => {
  it("renders flat rows with explicit tree position semantics", () => {
    render(
      <VirtualizedFileTree
        aria-label="Project files"
        defaultExpandedIds={["src"]}
        initialViewportSize={{ height: 160, width: 320 }}
        items={items}
      >
        {renderItem}
      </VirtualizedFileTree>
    )

    const alpha = getRow("alpha.ts")
    expect(alpha.parentElement?.getAttribute("role")).toBe("none")
    expect(alpha.getAttribute("aria-level")).toBe("2")
    expect(alpha.getAttribute("aria-posinset")).toBe("1")
    expect(alpha.getAttribute("aria-setsize")).toBe("2")
    expect(document.querySelector('[role="group"]')).toBeNull()
  })

  it("keeps the DOM near the viewport budget for a large logical tree", () => {
    const largeItems = Array.from({ length: 20_000 }, (_, index) => ({
      id: `file-${index}`,
      name: `file-${index}.txt`,
      type: "file" as const,
    }))

    render(
      <VirtualizedFileTree
        aria-label="Large files"
        initialViewportSize={{ height: 96, width: 320 }}
        items={largeItems}
        overscan={4}
      >
        {renderItem}
      </VirtualizedFileTree>
    )

    expect(
      screen.getByRole("tree").querySelectorAll('[role="treeitem"]')
    ).toHaveLength(7)
  })

  it("routes PageDown using the viewport height", async () => {
    render(
      <VirtualizedFileTree
        aria-label="Project files"
        defaultExpandedIds={["src"]}
        defaultFocusedId="src"
        initialViewportSize={{ height: 96, width: 320 }}
        items={items}
      >
        {renderItem}
      </VirtualizedFileTree>
    )

    const src = getRow("src")
    src.focus()
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      key: "PageDown",
    })
    fireEvent(src, event)

    expect(event.defaultPrevented).toBe(true)
    await waitFor(() =>
      expect(document.activeElement).toBe(getRow("README.md"))
    )
  })

  it("mounts and focuses a far imperative target by stable ID", async () => {
    const ref = React.createRef<VirtualizedFileTreeHandle>()
    const largeItems = Array.from({ length: 1_000 }, (_, index) => ({
      id: `file-${index}`,
      name: `file-${index}.txt`,
      type: "file" as const,
    }))

    render(
      <VirtualizedFileTree
        ref={ref}
        aria-label="Large files"
        defaultFocusedId="file-0"
        initialViewportSize={{ height: 96, width: 320 }}
        items={largeItems}
      >
        {renderItem}
      </VirtualizedFileTree>
    )

    ref.current?.focusItem("file-999")

    await waitFor(() => {
      expect(document.activeElement).toBe(getRow("file-999.txt"))
    })
  })

  it("reports mounted ranges in logical IDs", async () => {
    const onVirtualRangeChange = vi.fn()
    render(
      <VirtualizedFileTree
        aria-label="Project files"
        initialViewportSize={{ height: 64, width: 320 }}
        items={items}
        onVirtualRangeChange={onVirtualRangeChange}
        overscan={0}
      >
        {renderItem}
      </VirtualizedFileTree>
    )

    await waitFor(() => expect(onVirtualRangeChange).toHaveBeenCalled())
    expect(onVirtualRangeChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        startIndex: 0,
        visibleIds: expect.arrayContaining(["src", "readme"]),
      })
    )
  })
})
