import { describe, expect, it } from "vitest"

import {
  createFileTreeControllerSnapshot,
  getFileTreeEnabledId,
  getFileTreeFocusRecoveryId,
  getFileTreePageTargetId,
  getNextFileTreeEnabledId,
  isFileTreeOperationAvailable,
  transitionFileTreeOperationMode,
} from "./bases/base/ui/file-tree-controller"
import {
  createDefaultFileTreeAccessors,
  normalizeFileTree,
  type FileTreeNode,
} from "./bases/base/ui/file-tree-core"

const items: FileTreeNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "alpha", name: "alpha.ts", type: "file" },
      { id: "disabled", name: "disabled.ts", type: "file", disabled: true },
      { id: "beta", name: "beta.ts", type: "file" },
    ],
  },
  { id: "readme", name: "README.md", type: "file" },
]

function createTree(nextItems: readonly FileTreeNode[] = items) {
  return normalizeFileTree(nextItems, createDefaultFileTreeAccessors())
}

describe("file tree controller snapshots", () => {
  it("indexes the logical visible collection by stable ID", () => {
    const snapshot = createFileTreeControllerSnapshot(
      createTree(),
      new Set(["src"])
    )

    expect(snapshot.visibleIds).toEqual([
      "src",
      "alpha",
      "disabled",
      "beta",
      "readme",
    ])
    expect(snapshot.indexById.get("beta")).toBe(3)
    expect(snapshot.visibleIdSet.has("alpha")).toBe(true)
  })

  it("queries enabled rows without exposing viewport indexes", () => {
    const snapshot = createFileTreeControllerSnapshot(
      createTree(),
      new Set(["src"])
    )

    expect(getFileTreeEnabledId(snapshot, 2, 1)).toBe("beta")
    expect(getFileTreeEnabledId(snapshot, 2, -1)).toBe("alpha")
    expect(getNextFileTreeEnabledId(snapshot, "alpha", 1)).toBe("beta")
    expect(getFileTreePageTargetId(snapshot, "src", 2, 1)).toBe("beta")
    expect(getFileTreePageTargetId(snapshot, "readme", 2, -1)).toBe("alpha")
  })
})

describe("file tree focus recovery", () => {
  it("keeps a visible enabled focus target", () => {
    const tree = createTree()
    const next = createFileTreeControllerSnapshot(tree, new Set(["src"]))

    expect(
      getFileTreeFocusRecoveryId({
        focusedId: "alpha",
        previousTree: tree,
        next,
      })
    ).toBe("alpha")
  })

  it("prefers the next sibling, then the previous sibling", () => {
    const previousTree = createTree()
    const withoutAlpha = createTree([
      {
        ...items[0]!,
        children: items[0]!.children?.filter((item) => item.id !== "alpha"),
      },
      items[1]!,
    ])
    const withoutBeta = createTree([
      {
        ...items[0]!,
        children: items[0]!.children?.filter(
          (item) => item.id !== "alpha" && item.id !== "beta"
        ),
      },
      items[1]!,
    ])

    expect(
      getFileTreeFocusRecoveryId({
        focusedId: "alpha",
        previousTree,
        next: createFileTreeControllerSnapshot(withoutAlpha, new Set(["src"])),
      })
    ).toBe("beta")
    expect(
      getFileTreeFocusRecoveryId({
        focusedId: "beta",
        previousTree,
        next: createFileTreeControllerSnapshot(withoutBeta, new Set(["src"])),
      })
    ).toBe("src")
  })

  it("walks out of a removed subtree before falling back to the first row", () => {
    const previousTree = createTree()
    const nextTree = createTree([items[1]!])

    expect(
      getFileTreeFocusRecoveryId({
        focusedId: "alpha",
        previousTree,
        next: createFileTreeControllerSnapshot(nextTree, new Set()),
      })
    ).toBe("readme")
  })

  it("recovers a collapsed descendant to its visible ancestor", () => {
    const tree = createTree()

    expect(
      getFileTreeFocusRecoveryId({
        focusedId: "alpha",
        previousTree: tree,
        next: createFileTreeControllerSnapshot(tree, new Set()),
      })
    ).toBe("src")
  })
})

describe("file tree operation modes", () => {
  it("prevents rename and drag modes from overlapping", () => {
    const renaming = transitionFileTreeOperationMode("idle", {
      type: "startRename",
    })

    expect(renaming).toBe("renaming")
    expect(
      transitionFileTreeOperationMode(renaming, { type: "startKeyboardDrag" })
    ).toBe("renaming")
    expect(isFileTreeOperationAvailable(renaming, "keyboardDragging")).toBe(
      false
    )
    expect(transitionFileTreeOperationMode(renaming, { type: "cancel" })).toBe(
      "idle"
    )
  })

  it("allows either drag input to enter one pending move state", () => {
    expect(
      transitionFileTreeOperationMode("keyboardDragging", {
        type: "startPendingMove",
      })
    ).toBe("pendingMove")
    expect(
      transitionFileTreeOperationMode("pointerDragging", {
        type: "startPendingMove",
      })
    ).toBe("pendingMove")
  })
})
