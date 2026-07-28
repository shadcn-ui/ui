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
import { FileTreeItemDragHandle } from "./bases/base/ui/file-tree-sortable"
import { VirtualizedSortableFileTree } from "./bases/base/ui/file-tree-virtualized-sortable"

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

beforeEach(() => {
  vi.stubGlobal("ResizeObserver", TestResizeObserver)
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

describe("VirtualizedSortableFileTree", () => {
  it("keeps a 20,000-row sortable tree within the virtual DOM budget", async () => {
    const items: FileTreeNode[] = Array.from(
      { length: 20_000 },
      (_, index) => ({
        id: `file-${index}`,
        name: `file-${index}.txt`,
        type: "file",
      })
    )

    render(
      <VirtualizedSortableFileTree
        aria-label="Large project"
        initialViewportSize={{ height: 96, width: 320 }}
        isItemMovable
        items={items}
        onMove={vi.fn()}
        overscan={4}
      >
        {renderRow}
      </VirtualizedSortableFileTree>
    )

    await waitFor(() =>
      expect(
        screen.getByRole("tree").querySelectorAll('[role="treeitem"]').length
      ).toBeGreaterThan(0)
    )
    const rows = screen.getByRole("tree").querySelectorAll('[role="treeitem"]')
    expect(rows.length).toBeLessThanOrEqual(8)
    expect(rows[0]?.getAttribute("aria-posinset")).toBe("1")
    expect(rows[0]?.getAttribute("aria-setsize")).toBe("20000")
  })

  it("pins and scrolls to a far logical keyboard destination", async () => {
    const items: FileTreeNode[] = Array.from({ length: 1_000 }, (_, index) => ({
      id: `file-${index}`,
      name: `file-${index}.txt`,
      type: "file",
    }))
    render(
      <VirtualizedSortableFileTree
        aria-label="Large project"
        initialViewportSize={{ height: 96, width: 320 }}
        isItemMovable
        items={items}
        onMove={vi.fn()}
        overscan={2}
      >
        {renderRow}
      </VirtualizedSortableFileTree>
    )

    const handle = await screen.findByRole("button", {
      name: "Move file-0.txt",
    })
    handle.focus()
    fireEvent.keyDown(handle, { key: "Enter" })
    fireEvent.keyDown(handle, { key: "End" })

    await waitFor(() => expect(screen.getByTitle("file-999.txt")).toBeTruthy())
    expect(
      screen.getByRole("tree").querySelectorAll('[role="treeitem"]').length
    ).toBeLessThan(12)
    expect(screen.getByRole("tree").getAttribute("data-operation-mode")).toBe(
      "keyboardDragging"
    )
    fireEvent.keyDown(handle, { key: "Escape" })
  })

  it("commits the far destination with a post-removal index", async () => {
    const onMove = vi.fn()
    const items: FileTreeNode[] = Array.from({ length: 100 }, (_, index) => ({
      id: `file-${index}`,
      name: `file-${index}.txt`,
      type: "file",
    }))
    render(
      <VirtualizedSortableFileTree
        aria-label="Large project"
        initialViewportSize={{ height: 96, width: 320 }}
        isItemMovable
        items={items}
        onMove={onMove}
      >
        {renderRow}
      </VirtualizedSortableFileTree>
    )

    const handle = await screen.findByRole("button", {
      name: "Move file-0.txt",
    })
    fireEvent.keyDown(handle, { key: "Enter" })
    fireEvent.keyDown(handle, { key: "End" })
    fireEvent.keyDown(handle, { key: "Enter" })

    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1))
    expect(onMove.mock.calls[0]?.[0]).toMatchObject({
      draggedIds: ["file-0"],
      input: "command",
      target: {
        index: 99,
        itemId: "file-99",
        parentId: null,
        position: "after",
      },
    })
  })
})
