// @vitest-environment jsdom

import * as React from "react"
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  FileTree,
  FileTreeItem,
  FileTreeItemLabel,
  type FileTreeNode,
  type FileTreeProps,
} from "./bases/base/ui/file-tree"

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
  { id: "disabled", name: "disabled.txt", type: "file", disabled: true },
]

function renderTree(props: Partial<FileTreeProps<FileTreeNode>> = {}) {
  const {
    children = () => (
      <FileTreeItem>
        <FileTreeItemLabel />
      </FileTreeItem>
    ),
    ...rest
  } = props

  return render(
    <FileTree aria-label="Project files" items={items} {...rest}>
      {children}
    </FileTree>
  )
}

function getRow(name: string) {
  const row = screen.getByText(name).closest<HTMLElement>('[role="treeitem"]')
  if (!row) throw new Error(`Missing tree row for ${name}`)
  return row
}

async function expectFocus(name: string) {
  await waitFor(() => expect(document.activeElement).toBe(getRow(name)))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("FileTree APG keyboard conformance", () => {
  it("ArrowDown and ArrowUp move focus and skip disabled rows", async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpandedIds: ["src"] })

    getRow("src").focus()
    await user.keyboard("{ArrowDown}")
    await expectFocus("alpha.ts")
    await user.keyboard("{ArrowUp}")
    await expectFocus("src")

    getRow("README.md").focus()
    await user.keyboard("{ArrowDown}")
    expect(document.activeElement).toBe(getRow("README.md"))
  })

  it("Home and End focus the first and last enabled rows", async () => {
    const user = userEvent.setup()
    renderTree({ defaultExpandedIds: ["src"] })

    getRow("alpha.ts").focus()
    await user.keyboard("{End}")
    await expectFocus("README.md")
    await user.keyboard("{Home}")
    await expectFocus("src")
  })

  it("ArrowRight expands or enters a folder and ArrowLeft collapses or returns", async () => {
    const user = userEvent.setup()
    renderTree()

    const src = getRow("src")
    src.focus()
    await user.keyboard("{ArrowRight}")
    expect(src.getAttribute("aria-expanded")).toBe("true")

    await user.keyboard("{ArrowRight}")
    await expectFocus("alpha.ts")
    await user.keyboard("{ArrowLeft}")
    await expectFocus("src")
    await user.keyboard("{ArrowLeft}")
    expect(src.getAttribute("aria-expanded")).toBe("false")
  })

  it("Enter activates files and toggles folders without an action callback", async () => {
    const user = userEvent.setup()
    const onItemAction = vi.fn()
    renderTree({ defaultFocusedId: "readme", onItemAction })

    getRow("README.md").focus()
    await user.keyboard("{Enter}")
    expect(onItemAction).toHaveBeenCalledWith(
      expect.objectContaining({ id: "readme" }),
      expect.objectContaining({ id: "readme", reason: "keyboard" })
    )

    const src = getRow("src")
    await user.click(src)
    await user.keyboard("{Enter}")
    expect(src.getAttribute("aria-expanded")).toBe("true")
  })

  it("Space toggles multiple selection and Shift+Space selects the anchored range", async () => {
    const user = userEvent.setup()
    renderTree({
      defaultExpandedIds: ["src"],
      selectionMode: "multiple",
    })

    getRow("src").focus()
    await user.keyboard(" ")
    await user.keyboard("{ArrowDown}")
    await user.keyboard("{Shift>} {/Shift}")

    expect(getRow("src").getAttribute("aria-selected")).toBe("true")
    expect(getRow("alpha.ts").getAttribute("aria-selected")).toBe("true")

    await user.keyboard(" ")
    expect(getRow("alpha.ts").getAttribute("aria-selected")).toBe("false")
  })

  it("Shift+ArrowDown and Shift+ArrowUp extend a contiguous selection", async () => {
    const user = userEvent.setup()
    renderTree({
      defaultExpandedIds: ["src"],
      selectionMode: "multiple",
    })

    getRow("src").focus()
    await user.keyboard(" ")
    await user.keyboard("{Shift>}{ArrowDown}{ArrowDown}{/Shift}")
    expect(getRow("beta.ts").getAttribute("aria-selected")).toBe("true")

    await user.keyboard("{Shift>}{ArrowUp}{/Shift}")
    expect(getRow("alpha.ts").getAttribute("aria-selected")).toBe("true")
    expect(getRow("beta.ts").getAttribute("aria-selected")).toBe("false")
  })

  it.each([
    [
      "Control",
      { ctrlKey: true, metaKey: false, platform: "windows" as const },
    ],
    ["Meta", { ctrlKey: false, metaKey: true, platform: "macos" as const }],
  ])("%s+A selects every selectable visible row", (_, options) => {
    renderTree({
      defaultExpandedIds: ["src"],
      selectionMode: "multiple",
      shortcuts: { platform: options.platform },
    })

    const row = getRow("src")
    row.focus()
    fireEvent.keyDown(row, {
      key: "a",
      ctrlKey: options.ctrlKey,
      metaKey: options.metaKey,
    })

    expect(getRow("src").getAttribute("aria-selected")).toBe("true")
    expect(getRow("alpha.ts").getAttribute("aria-selected")).toBe("true")
    expect(getRow("README.md").getAttribute("aria-selected")).toBe("true")
    expect(getRow("disabled.txt").getAttribute("aria-selected")).toBe(null)
  })

  it("* expands every expandable sibling", () => {
    const folders: FileTreeNode[] = [
      {
        id: "one",
        name: "One",
        type: "folder",
        children: [{ id: "one-file", name: "one.txt", type: "file" }],
      },
      {
        id: "two",
        name: "Two",
        type: "folder",
        children: [{ id: "two-file", name: "two.txt", type: "file" }],
      },
    ]
    renderTree({ items: folders })

    const one = getRow("One")
    one.focus()
    fireEvent.keyDown(one, { key: "*", shiftKey: true })

    expect(one.getAttribute("aria-expanded")).toBe("true")
    expect(getRow("Two").getAttribute("aria-expanded")).toBe("true")
  })

  it("F2 starts rename and Escape cancels it with focus restoration", async () => {
    const user = userEvent.setup()
    renderTree({ defaultFocusedId: "readme", onRename: vi.fn() })

    const readme = getRow("README.md")
    readme.focus()
    await user.keyboard("{F2}")
    const input = screen.getByRole("textbox", { name: "Rename README.md" })
    expect(input).not.toBeNull()

    await user.keyboard("{Escape}")
    expect(screen.queryByRole("textbox")).toBeNull()
    await waitFor(() => expect(document.activeElement).toBe(readme))
  })

  it.each([
    ["Shift+F10", { key: "F10", shiftKey: true }],
    ["Context Menu", { key: "ContextMenu" }],
  ])("%s invokes the keyboard context-menu callback", (_, init) => {
    const onItemContextMenu = vi.fn()
    renderTree({ defaultFocusedId: "readme", onItemContextMenu })

    const readme = getRow("README.md")
    readme.focus()
    fireEvent.keyDown(readme, init)

    expect(onItemContextMenu).toHaveBeenCalledWith(
      expect.objectContaining({ id: "readme" }),
      expect.objectContaining({ reason: "keyboard" })
    )
  })

  it("buffers typeahead, cycles repeated characters, and resets after its timeout", async () => {
    const now = vi.spyOn(Date, "now")
    renderTree({
      defaultFocusedId: "beta",
      items: [
        { id: "alpha", name: "Alpha", type: "file" },
        { id: "alpine", name: "Alpine", type: "file" },
        { id: "beta", name: "Beta", type: "file" },
      ],
    })

    now.mockReturnValue(100)
    getRow("Beta").focus()
    fireEvent.keyDown(getRow("Beta"), { key: "a" })
    await expectFocus("Alpha")

    now.mockReturnValue(200)
    fireEvent.keyDown(getRow("Alpha"), { key: "a" })
    await expectFocus("Alpine")

    now.mockReturnValue(800)
    fireEvent.keyDown(getRow("Alpine"), { key: "b" })
    await expectFocus("Beta")
  })
})

describe("FileTree shortcut safety and customization", () => {
  it("does not run non-repeatable activation or rename commands on key repeat", () => {
    const onItemAction = vi.fn()
    renderTree({
      defaultFocusedId: "readme",
      onItemAction,
      onRename: vi.fn(),
    })

    const readme = getRow("README.md")
    readme.focus()
    fireEvent.keyDown(readme, { key: "Enter", repeat: true })
    fireEvent.keyDown(readme, { key: "F2", repeat: true })

    expect(onItemAction).not.toHaveBeenCalled()
    expect(screen.queryByRole("textbox")).toBeNull()
  })

  it("ignores IME composition for activation, rename, and typeahead", () => {
    const onItemAction = vi.fn()
    renderTree({
      defaultFocusedId: "readme",
      onItemAction,
      onRename: vi.fn(),
    })

    const readme = getRow("README.md")
    readme.focus()
    fireEvent.keyDown(readme, { key: "Enter", isComposing: true })
    fireEvent.keyDown(readme, { key: "F2", isComposing: true })
    fireEvent.keyDown(readme, { key: "s", isComposing: true })

    expect(onItemAction).not.toHaveBeenCalled()
    expect(screen.queryByRole("textbox")).toBeNull()
    expect(document.activeElement).toBe(readme)
  })

  it("ignores AltGraph combinations", () => {
    const run = vi.fn()
    renderTree({
      commands: [
        {
          id: "at-sign",
          label: "At sign",
          shortcuts: { key: "@", alt: true, control: true },
          run,
        },
      ],
    })

    const readme = getRow("README.md")
    readme.focus()
    const event = new KeyboardEvent("keydown", {
      key: "@",
      altKey: true,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, "getModifierState", {
      value: (key: string) => key === "AltGraph",
    })
    fireEvent(readme, event)

    expect(run).not.toHaveBeenCalled()
    expect(event.defaultPrevented).toBe(false)
  })

  it("adds safe aliases without removing canonical navigation", async () => {
    renderTree({
      shortcuts: {
        platform: "windows",
        bindings: {
          focusNext: { key: "j", control: true },
        },
      },
    })

    const src = getRow("src")
    src.focus()
    fireEvent.keyDown(src, { key: "j", ctrlKey: true })
    await expectFocus("README.md")

    fireEvent.keyDown(getRow("README.md"), { key: "ArrowUp" })
    await expectFocus("src")
  })

  it("can disable application shortcuts without capturing their key", () => {
    renderTree({
      defaultFocusedId: "readme",
      onRename: vi.fn(),
      shortcuts: { bindings: { rename: false } },
    })

    const readme = getRow("README.md")
    readme.focus()
    const event = new KeyboardEvent("keydown", {
      key: "F2",
      bubbles: true,
      cancelable: true,
    })
    fireEvent(readme, event)

    expect(event.defaultPrevented).toBe(false)
    expect(screen.queryByRole("textbox")).toBeNull()
  })

  it("runs a custom command with smart platform defaults and typed context", () => {
    const run = vi.fn()
    renderTree({
      defaultFocusedId: "readme",
      defaultSelectedIds: ["readme"],
      commands: [
        {
          id: "createFolder",
          label: "New folder",
          run,
        },
      ],
      shortcuts: { platform: "windows" },
    })

    const readme = getRow("README.md")
    readme.focus()
    fireEvent.keyDown(readme, {
      key: "n",
      ctrlKey: true,
      shiftKey: true,
    })

    expect(run).toHaveBeenCalledWith(
      expect.objectContaining({
        focusedId: "readme",
        selectedIds: ["readme"],
        platform: "windows",
      }),
      expect.any(Object)
    )
  })

  it("reports custom command failures", async () => {
    const onCommandError = vi.fn()
    const error = new Error("Command failed")
    renderTree({
      defaultFocusedId: "readme",
      commands: [
        {
          id: "inspect",
          label: "Inspect",
          shortcuts: { key: "i", alt: true },
          run: () => Promise.reject(error),
        },
      ],
      onCommandError,
    })

    const readme = getRow("README.md")
    readme.focus()
    fireEvent.keyDown(readme, { key: "i", altKey: true })

    await waitFor(() =>
      expect(onCommandError).toHaveBeenCalledWith(
        expect.objectContaining({ error })
      )
    )
  })

  it("reports conflicts and rejects a custom command that shadows navigation", async () => {
    const onConflict = vi.fn()
    const run = vi.fn()
    renderTree({
      commands: [
        {
          id: "bad",
          label: "Bad",
          shortcuts: { key: "ArrowDown" },
          run,
        },
      ],
      shortcuts: { onConflict },
    })

    await waitFor(() =>
      expect(onConflict).toHaveBeenCalledWith(
        expect.objectContaining({
          commandId: "bad",
          conflictingCommandId: "focusNext",
          reason: "duplicate",
        })
      )
    )
    const src = getRow("src")
    src.focus()
    fireEvent.keyDown(src, { key: "ArrowDown" })
    expect(run).not.toHaveBeenCalled()
  })
})

describe("FileTree Phase 1 state and localization", () => {
  it("keeps current, focus, and selection distinct", () => {
    renderTree({
      currentId: "readme",
      defaultFocusedId: "src",
      defaultSelectedIds: ["src"],
    })

    expect(getRow("README.md").getAttribute("aria-current")).toBe("page")
    expect(getRow("README.md").getAttribute("aria-selected")).toBe("false")
    expect(getRow("src").getAttribute("aria-current")).toBe(null)
    expect(getRow("src").getAttribute("aria-selected")).toBe("true")
  })

  it("honors selectable and actionable capability predicates", () => {
    const onItemAction = vi.fn()
    const onSelectedIdsChange = vi.fn()
    renderTree({
      defaultFocusedId: "readme",
      isItemActionable: (item) => item.id !== "readme",
      isItemSelectable: (item) => item.id !== "readme",
      onItemAction,
      onSelectedIdsChange,
    })

    const readme = getRow("README.md")
    readme.focus()
    const space = new KeyboardEvent("keydown", {
      key: " ",
      bubbles: true,
      cancelable: true,
    })
    fireEvent(readme, space)
    fireEvent.keyDown(readme, { key: "Enter" })

    expect(readme.getAttribute("aria-selected")).toBe(null)
    expect(space.defaultPrevented).toBe(false)
    expect(onSelectedIdsChange).not.toHaveBeenCalled()
    expect(onItemAction).not.toHaveBeenCalled()
  })

  it("localizes visible labels, rename instructions, and announcements", async () => {
    const user = userEvent.setup()
    renderTree({
      items: [],
      messages: { empty: "Aucun fichier" },
    })
    expect(screen.getByText("Aucun fichier")).not.toBeNull()

    cleanup()
    renderTree({
      defaultFocusedId: "readme",
      messages: {
        renameInstructions: "Entrée pour enregistrer. Échap pour annuler.",
        renameLabel: (name) => `Renommer ${name}`,
        renaming: (name) => `Renommage de ${name}`,
      },
      onRename: vi.fn(),
    })

    const readme = getRow("README.md")
    readme.focus()
    await user.keyboard("{F2}")
    expect(
      screen.getByRole("textbox", { name: "Renommer README.md" })
    ).not.toBeNull()
    expect(
      screen.getByText("Entrée pour enregistrer. Échap pour annuler.")
    ).not.toBeNull()
    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="file-tree-live-region"]')
          ?.textContent
      ).toBe("Renommage de README.md")
    )
  })

  it("preserves controlled callback payloads after command routing", () => {
    const onFocusedIdChange = vi.fn()
    const onSelectedIdsChange = vi.fn()
    renderTree({
      focusedId: "src",
      onFocusedIdChange,
      onSelectedIdsChange,
      selectedIds: [],
    })

    const src = getRow("src")
    src.focus()
    fireEvent.keyDown(src, { key: "ArrowDown" })
    fireEvent.keyDown(src, { key: " " })

    expect(onFocusedIdChange).toHaveBeenCalledWith(
      "readme",
      expect.objectContaining({ reason: "keyboard" })
    )
    expect(onSelectedIdsChange).toHaveBeenCalledWith(
      ["src"],
      expect.objectContaining({ reason: "keyboard" })
    )
  })

  it("exposes capability state to custom row renderers", () => {
    const states: Array<{
      id: string
      current: boolean
      editable: boolean
      movable: boolean
      droppable: boolean
    }> = []
    renderTree({
      currentId: "src",
      isItemDroppable: true,
      isItemMovable: (item) => item.id === "readme",
      onRename: vi.fn(),
      children: ({ id, name, state }) => {
        states.push({
          id,
          current: state.isCurrent,
          editable: state.isEditable,
          movable: state.isMovable,
          droppable: state.isDroppable,
        })
        return (
          <FileTreeItem>
            <FileTreeItemLabel>{name}</FileTreeItemLabel>
          </FileTreeItem>
        )
      },
    })

    expect(states).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "src",
          current: true,
          editable: true,
          droppable: true,
        }),
        expect.objectContaining({
          id: "readme",
          movable: true,
          droppable: false,
        }),
      ])
    )
  })
})

describe("FileTree shared controller integration", () => {
  it("rerenders only rows whose focus state changes", async () => {
    const counts = new Map<string, number>()
    const manyItems = Array.from({ length: 100 }, (_, index) => ({
      id: `file-${index}`,
      name: `file-${index}.txt`,
      type: "file" as const,
    }))
    render(
      <FileTree
        aria-label="Project files"
        defaultFocusedId="file-0"
        items={manyItems}
        selectionMode="none"
      >
        {({ id, name }) => {
          counts.set(id, (counts.get(id) ?? 0) + 1)
          return (
            <FileTreeItem>
              <FileTreeItemLabel>{name}</FileTreeItemLabel>
            </FileTreeItem>
          )
        }}
      </FileTree>
    )

    await waitFor(() => expect(counts.get("file-50")).toBeGreaterThan(0))
    await new Promise<void>((resolve) => queueMicrotask(resolve))
    const before = new Map(counts)
    const first = getRow("file-0.txt")
    first.focus()
    fireEvent.keyDown(first, { key: "ArrowDown" })

    await expectFocus("file-1.txt")
    expect(counts.get("file-0")).toBe((before.get("file-0") ?? 0) + 1)
    expect(counts.get("file-1")).toBe((before.get("file-1") ?? 0) + 1)
    expect(counts.get("file-50")).toBe(before.get("file-50"))
  })

  it("recovers DOM and logical focus to the next sibling after data removal", async () => {
    const user = userEvent.setup()
    const onFocusedIdChange = vi.fn()

    function RecoveryFixture() {
      const [fixtureItems, setFixtureItems] = React.useState(items)

      return (
        <>
          <button
            type="button"
            onClick={() =>
              setFixtureItems((current) => [
                {
                  ...current[0]!,
                  children: current[0]!.children?.filter(
                    (item) => item.id !== "alpha"
                  ),
                },
                ...current.slice(1),
              ])
            }
          >
            Remove alpha
          </button>
          <FileTree
            aria-label="Project files"
            defaultExpandedIds={["src"]}
            defaultFocusedId="alpha"
            items={fixtureItems}
            onFocusedIdChange={onFocusedIdChange}
          >
            {({ name }) => (
              <FileTreeItem>
                <FileTreeItemLabel>{name}</FileTreeItemLabel>
              </FileTreeItem>
            )}
          </FileTree>
        </>
      )
    }

    render(<RecoveryFixture />)
    getRow("alpha.ts").focus()
    await user.click(screen.getByRole("button", { name: "Remove alpha" }))

    await expectFocus("beta.ts")
    expect(onFocusedIdChange).toHaveBeenCalledWith(
      "beta",
      expect.objectContaining({ reason: "data-change" })
    )
  })

  it("exposes the exclusive operation mode while renaming", async () => {
    const user = userEvent.setup()
    renderTree({ defaultFocusedId: "readme", onRename: vi.fn() })

    const readme = getRow("README.md")
    const tree = screen.getByRole("tree", { name: "Project files" })
    readme.focus()
    await user.keyboard("{F2}")
    expect(tree.getAttribute("data-operation-mode")).toBe("renaming")

    await user.keyboard("{Escape}")
    expect(tree.getAttribute("data-operation-mode")).toBe("idle")
  })
})
