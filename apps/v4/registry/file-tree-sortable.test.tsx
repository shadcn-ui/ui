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
  FileTreeItemDragHandle,
  SortableFileTree,
} from "./bases/base/ui/file-tree-sortable"

const { TestResizeObserver } = vi.hoisted(() => {
  class HoistedResizeObserver {
    constructor(_callback: ResizeObserverCallback) {}
    disconnect() {}
    observe(_target: Element) {}
    unobserve() {}
  }

  Object.defineProperty(globalThis, "ResizeObserver", {
    configurable: true,
    value: HoistedResizeObserver,
  })

  return { TestResizeObserver: HoistedResizeObserver }
})

class TestIntersectionObserver {
  readonly root = null
  readonly rootMargin = "0px"
  readonly thresholds = [0]
  disconnect() {}
  observe(_target: Element) {}
  takeRecords() {
    return []
  }
  unobserve(_target: Element) {}
}

const items: FileTreeNode[] = [
  { id: "alpha", name: "alpha.ts", type: "file" },
  { id: "beta", name: "beta.ts", type: "file" },
  { id: "docs", name: "docs", type: "folder", children: [] },
]

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", TestResizeObserver)
  vi.stubGlobal("IntersectionObserver", TestIntersectionObserver)
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      addEventListener: vi.fn(),
      matches: false,
      removeEventListener: vi.fn(),
    }),
  })
  Object.defineProperty(Element.prototype, "getAnimations", {
    configurable: true,
    value: () => [],
  })
  Object.defineProperty(Element.prototype, "animate", {
    configurable: true,
    value: () => ({ finished: Promise.resolve() }),
  })
  Object.defineProperty(document, "getAnimations", {
    configurable: true,
    value: () => [],
  })
  Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
    configurable: true,
    value() {
      const index = Number(this.getAttribute("data-index") ?? 0)
      const top = index * 32
      return {
        bottom: top + 32,
        height: 32,
        left: 0,
        right: 320,
        top,
        width: 320,
        x: 0,
        y: top,
        toJSON: () => ({}),
      }
    },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const renderRow = ({ name }: { name: string }) => (
  <FileTreeItem>
    <FileTreeItemLabel>{name}</FileTreeItemLabel>
    <FileTreeItemDragHandle />
  </FileTreeItem>
)

describe("SortableFileTree", () => {
  it("uses explicit, localized drag handles and flat tree semantics", () => {
    render(
      <SortableFileTree
        aria-label="Project files"
        isItemDroppable={(item) => item.type === "folder"}
        isItemMovable={(item) => item.id !== "beta"}
        items={items}
        moveMessages={{ handleLabel: (name) => `Relocate ${name}` }}
        onMove={vi.fn()}
      >
        {renderRow}
      </SortableFileTree>
    )

    const alphaHandle = screen.getByRole("button", {
      name: "Relocate alpha.ts",
    })
    const betaHandle = screen.getByRole("button", {
      name: "Relocate beta.ts",
    })
    const alphaRow = screen.getByTitle("alpha.ts").closest('[role="treeitem"]')

    expect(alphaHandle.getAttribute("aria-keyshortcuts")).toBe("Enter Space")
    expect(alphaHandle.getAttribute("aria-describedby")).toBeTruthy()
    expect((betaHandle as HTMLButtonElement).disabled).toBe(true)
    expect(alphaRow?.getAttribute("aria-level")).toBe("1")
    expect(document.querySelector('[role="group"]')).toBeNull()
  })

  it("keeps handle clicks from changing tree selection", () => {
    const onSelectedIdsChange = vi.fn()
    render(
      <SortableFileTree
        aria-label="Project files"
        isItemMovable
        items={items}
        onMove={vi.fn()}
        onSelectedIdsChange={onSelectedIdsChange}
      >
        {renderRow}
      </SortableFileTree>
    )

    fireEvent.click(screen.getByRole("button", { name: "Move alpha.ts" }))
    expect(onSelectedIdsChange).not.toHaveBeenCalled()
  })

  it("supports keyboard pickup and Escape cancellation from the handle", async () => {
    render(
      <SortableFileTree
        aria-label="Project files"
        isItemMovable
        items={items}
        onMove={vi.fn()}
      >
        {renderRow}
      </SortableFileTree>
    )

    const handle = screen.getByRole("button", { name: "Move alpha.ts" })
    handle.focus()
    fireEvent.keyDown(handle, { code: "Enter", key: "Enter" })

    await waitFor(() =>
      expect(screen.getByRole("tree").getAttribute("data-operation-mode")).toBe(
        "keyboardDragging"
      )
    )
    fireEvent.keyDown(handle, { code: "Escape", key: "Escape" })
    await waitFor(() =>
      expect(screen.getByRole("tree").getAttribute("data-operation-mode")).toBe(
        "idle"
      )
    )
  })

  it("moves through logical keyboard destinations and commits an intent", async () => {
    const onMove = vi.fn()
    render(
      <SortableFileTree
        aria-label="Project files"
        isItemMovable
        items={items}
        onMove={onMove}
      >
        {renderRow}
      </SortableFileTree>
    )

    const handle = screen.getByRole("button", { name: "Move alpha.ts" })
    handle.focus()
    fireEvent.keyDown(handle, { key: "Enter" })
    fireEvent.keyDown(handle, { key: "ArrowDown" })
    fireEvent.keyDown(handle, { key: "Enter" })

    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1))
    expect(onMove.mock.calls[0]?.[0]).toMatchObject({
      draggedIds: ["alpha"],
      input: "command",
      target: {
        index: 1,
        itemId: "beta",
        parentId: null,
        position: "after",
      },
    })
  })
})
