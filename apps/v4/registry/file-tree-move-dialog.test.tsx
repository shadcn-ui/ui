// @vitest-environment jsdom

import * as React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, it, vi } from "vitest"

import type { FileTreeNode } from "./bases/base/ui/file-tree"
import { FileTreeMoveDialog } from "./bases/base/ui/file-tree-move-dialog"

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
  {
    id: "docs",
    name: "docs",
    type: "folder",
    children: [{ id: "guide", name: "guide.md", type: "file" }],
  },
]

afterEach(() => cleanup())

function chooseOption(select: HTMLElement, label: string) {
  const option = screen.getByRole("option", {
    name: label,
  }) as HTMLOptionElement
  fireEvent.change(select, { target: { value: option.value } })
}

describe("FileTreeMoveDialog", () => {
  it("emits a command intent for a distant insertion position", async () => {
    const onMove = vi.fn()
    const onOpenChange = vi.fn()
    render(
      <FileTreeMoveDialog
        defaultOpen
        draggedIds={["alpha"]}
        items={items}
        onMove={onMove}
        onOpenChange={onOpenChange}
      />
    )

    chooseOption(screen.getByLabelText("Destination folder"), "docs")
    chooseOption(screen.getByLabelText("Position"), "After guide.md")
    fireEvent.click(screen.getByRole("button", { name: "Move" }))

    await waitFor(() => expect(onMove).toHaveBeenCalledTimes(1))
    expect(onMove.mock.calls[0]?.[0]).toMatchObject({
      draggedIds: ["alpha"],
      input: "command",
      target: {
        index: 1,
        itemId: "guide",
        parentId: "docs",
        position: "after",
      },
    })
    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })

  it("uses the same capability rules to remove illegal destinations", () => {
    render(
      <FileTreeMoveDialog
        defaultOpen
        draggedIds={["src"]}
        isItemDroppable={false}
        items={items}
        onMove={vi.fn()}
      />
    )

    expect(screen.getByLabelText("Destination folder")).toHaveLength(1)
    expect(screen.queryByRole("option", { name: "src" })).toBeNull()
    expect(screen.queryByRole("option", { name: "docs" })).toBeNull()
  })

  it("keeps the dialog open and reports an async move error", async () => {
    const onMoveError = vi.fn()
    render(
      <FileTreeMoveDialog
        defaultOpen
        draggedIds={["alpha"]}
        items={items}
        onMove={() => Promise.reject(new Error("Permission denied."))}
        onMoveError={onMoveError}
      />
    )

    fireEvent.click(screen.getByRole("button", { name: "Move" }))

    expect((await screen.findByRole("alert")).textContent).toBe(
      "Move failed. Permission denied."
    )
    expect(screen.getByRole("dialog")).toBeTruthy()
    expect(onMoveError).toHaveBeenCalledTimes(1)
  })
})
