import * as React from "react"
import { describe, expectTypeOf, it } from "vitest"

import {
  FileTree,
  type FileTreeAccessors,
  type FileTreeCommand,
  type FileTreeHandle,
  type FileTreeMessages,
  type FileTreeNode,
  type FileTreeShortcutConfig,
} from "./bases/base/ui/file-tree"
import { FileTreeMoveDialog } from "./bases/base/ui/file-tree-move-dialog"
import { SortableFileTree } from "./bases/base/ui/file-tree-sortable"
import { VirtualizedFileTree } from "./bases/base/ui/file-tree-virtualized"
import { VirtualizedSortableFileTree } from "./bases/base/ui/file-tree-virtualized-sortable"

const readonlyItems = [
  { id: "src", name: "src", type: "folder", children: [] },
] as const satisfies readonly FileTreeNode[]

interface DomainEntry {
  key: string
  label: string
  directory: boolean
  entries?: readonly DomainEntry[]
}

const domainItems: readonly DomainEntry[] = [
  { key: "one", label: "One", directory: false },
]

const accessors: FileTreeAccessors<DomainEntry> = {
  getItemId: (item) => item.key,
  getItemName: (item) => item.label,
  getItemType: (item) => (item.directory ? "folder" : "file"),
  getItemChildren: (item) => item.entries,
}

describe("FileTree types", () => {
  it("preserves default data, custom data, readonly arrays, and the ref", () => {
    const ref = React.createRef<FileTreeHandle>()

    const defaultTree = (
      <FileTree ref={ref} aria-label="Files" items={readonlyItems} />
    )
    const customTree = (
      <FileTree
        accessors={accessors}
        aria-label="Domain files"
        currentId="one"
        items={domainItems}
        isItemActionable={(item) => {
          expectTypeOf(item).toEqualTypeOf<DomainEntry>()
          return true
        }}
        onItemAction={(item) => expectTypeOf(item).toEqualTypeOf<DomainEntry>()}
      >
        {({ item, state }) => {
          expectTypeOf(item).toEqualTypeOf<DomainEntry>()
          expectTypeOf(state.isCurrent).toEqualTypeOf<boolean>()
          expectTypeOf(state.isSelectable).toEqualTypeOf<boolean>()
          return item.label
        }}
      </FileTree>
    )

    expectTypeOf(defaultTree).toMatchTypeOf<React.ReactElement>()
    expectTypeOf(customTree).toMatchTypeOf<React.ReactElement>()
    expectTypeOf(ref.current).toEqualTypeOf<FileTreeHandle | null>()
  })

  it("infers command contexts and command errors from custom data", () => {
    const command: FileTreeCommand<DomainEntry> = {
      id: "inspect",
      label: "Inspect",
      shortcuts: { key: "i", primary: true },
      canRun: (context) => {
        expectTypeOf(context.focusedItem).toEqualTypeOf<DomainEntry | null>()
        expectTypeOf(context.selectedItems).toEqualTypeOf<
          readonly DomainEntry[]
        >()
        return true
      },
      run: (context, event) => {
        expectTypeOf(context.platform).toEqualTypeOf<
          "macos" | "windows" | "linux" | undefined
        >()
        expectTypeOf(event).toEqualTypeOf<React.KeyboardEvent<HTMLDivElement>>()
      },
    }

    const tree = (
      <FileTree
        accessors={accessors}
        aria-label="Domain files"
        commands={[command]}
        items={domainItems}
        onCommandError={({ command: failedCommand, context, error }) => {
          expectTypeOf(failedCommand).toEqualTypeOf<
            FileTreeCommand<DomainEntry>
          >()
          expectTypeOf(context.focusedItem).toEqualTypeOf<DomainEntry | null>()
          expectTypeOf(error).toBeUnknown()
        }}
      />
    )

    expectTypeOf(tree).toMatchTypeOf<React.ReactElement>()
  })

  it("types shortcut and localization overrides independently", () => {
    const shortcuts = {
      platform: "macos",
      bindings: {
        rename: false,
        focusNext: [
          { key: "ArrowDown", allowRepeat: true },
          { key: "j", control: true },
        ],
      },
    } satisfies FileTreeShortcutConfig

    const messages = {
      empty: "No entries",
      selectedCount: (count) => `${count} selected`,
    } satisfies Partial<FileTreeMessages>

    expectTypeOf(shortcuts.platform).toEqualTypeOf<"macos">()
    expectTypeOf(messages.selectedCount).toEqualTypeOf<
      (count: number) => string
    >()
  })

  it("preserves custom item types through every optional companion", () => {
    const virtualized = (
      <VirtualizedFileTree
        accessors={accessors}
        aria-label="Virtual domain files"
        estimateSize={(item) => {
          expectTypeOf(item).toEqualTypeOf<DomainEntry>()
          return 32
        }}
        items={domainItems}
      />
    )
    const sortable = (
      <SortableFileTree
        accessors={accessors}
        aria-label="Sortable domain files"
        isItemMovable
        items={domainItems}
        onMove={(intent) => {
          expectTypeOf(intent.draggedItems).toEqualTypeOf<
            readonly DomainEntry[]
          >()
        }}
        renderDragPreview={({ item }) => {
          expectTypeOf(item).toEqualTypeOf<DomainEntry>()
          return item.label
        }}
      />
    )
    const combined = (
      <VirtualizedSortableFileTree
        accessors={accessors}
        aria-label="Virtual sortable domain files"
        isItemMovable
        items={domainItems}
        onMove={(intent) => {
          expectTypeOf(intent.draggedItems).toEqualTypeOf<
            readonly DomainEntry[]
          >()
        }}
      />
    )
    const moveDialog = (
      <FileTreeMoveDialog
        accessors={accessors}
        draggedIds={["one"]}
        items={domainItems}
        onMove={(intent) => {
          expectTypeOf(intent.draggedItems).toEqualTypeOf<
            readonly DomainEntry[]
          >()
        }}
      />
    )

    expectTypeOf(virtualized).toMatchTypeOf<React.ReactElement>()
    expectTypeOf(sortable).toMatchTypeOf<React.ReactElement>()
    expectTypeOf(combined).toMatchTypeOf<React.ReactElement>()
    expectTypeOf(moveDialog).toMatchTypeOf<React.ReactElement>()
  })

  it("rejects invalid item and accessor shapes", () => {
    const invalidItems = [
      // @ts-expect-error - item types are limited to files and folders.
      { id: "bad", name: "Bad", type: "directory" },
    ] satisfies FileTreeNode[]

    const invalidAccessors: FileTreeAccessors<DomainEntry> = {
      // @ts-expect-error - IDs must be strings.
      getItemId: (item) => item.label.length,
      getItemName: (item) => item.label,
      getItemType: () => "file",
      getItemChildren: (item) => item.entries,
    }

    expectTypeOf(invalidItems).toBeArray()
    expectTypeOf(invalidAccessors).toMatchTypeOf<
      FileTreeAccessors<DomainEntry>
    >()
  })
})
