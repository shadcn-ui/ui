import { describe, expect, it, vi } from "vitest"

import {
  FILE_TREE_BASE_COMMAND_ORDER,
  FILE_TREE_DEFAULT_SHORTCUTS,
  getFileTreeAriaKeyShortcuts,
  getFileTreeShortcutCommand,
  getFileTreeShortcutLabel,
  matchFileTreeShortcut,
  resolveFileTreeShortcuts,
  validateFileTreeShortcutCommands,
  type FileTreeShortcutEvent,
} from "./bases/base/ui/file-tree-shortcuts"

function keyboardEvent(
  key: string,
  overrides: Partial<FileTreeShortcutEvent> = {}
): FileTreeShortcutEvent {
  return {
    key,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    ...overrides,
  }
}

describe("file tree shortcut matching", () => {
  it.each([
    ["macos", { metaKey: true }, true],
    ["macos", { ctrlKey: true }, false],
    ["windows", { ctrlKey: true }, true],
    ["windows", { metaKey: true }, false],
    ["linux", { ctrlKey: true }, true],
    [undefined, { ctrlKey: true }, true],
    [undefined, { metaKey: true }, true],
    [undefined, { ctrlKey: true, metaKey: true }, false],
  ] as const)("resolves primary on %s", (platform, modifiers, expected) => {
    expect(
      matchFileTreeShortcut(
        keyboardEvent("a", modifiers),
        { key: "a", primary: true },
        { platform }
      )
    ).toBe(expected)
  })

  it("matches exact modifiers and optional physical codes", () => {
    expect(
      matchFileTreeShortcut(
        keyboardEvent("ArrowDown", { shiftKey: true }),
        { key: "ArrowDown" },
        { platform: "windows" }
      )
    ).toBe(false)
    expect(
      matchFileTreeShortcut(
        keyboardEvent("z", { code: "KeyY" }),
        { key: "y", code: "KeyY" },
        { platform: "windows" }
      )
    ).toBe(true)
  })

  it("allows navigation repeat and blocks destructive repeat", () => {
    expect(
      matchFileTreeShortcut(keyboardEvent("ArrowDown", { repeat: true }), {
        key: "ArrowDown",
        allowRepeat: true,
      })
    ).toBe(true)
    expect(
      matchFileTreeShortcut(keyboardEvent("Delete", { repeat: true }), {
        key: "Delete",
        allowRepeat: false,
      })
    ).toBe(false)
  })

  it("ignores composition and AltGraph", () => {
    expect(
      matchFileTreeShortcut(keyboardEvent("a", { isComposing: true }), {
        key: "a",
      })
    ).toBe(false)
    expect(
      matchFileTreeShortcut(
        keyboardEvent("@", {
          altKey: true,
          ctrlKey: true,
          getModifierState: (key) => key === "AltGraph",
        }),
        { key: "@", alt: true, control: true }
      )
    ).toBe(false)
  })
})

describe("file tree shortcut resolution", () => {
  it("protects required navigation while allowing aliases", () => {
    const disabled = resolveFileTreeShortcuts({
      bindings: { focusNext: false },
    })
    expect(disabled.bindings.focusNext).toEqual(
      FILE_TREE_DEFAULT_SHORTCUTS.focusNext
    )
    expect(disabled.conflicts).toEqual([
      expect.objectContaining({
        commandId: "focusNext",
        reason: "unsafe-navigation-override",
      }),
    ])

    const aliased = resolveFileTreeShortcuts({
      bindings: { focusNext: { key: "j", control: true } },
    })
    expect(aliased.bindings.focusNext).toEqual([
      { key: "ArrowDown", allowRepeat: true },
      { key: "j", control: true },
    ])

    const unsafe = resolveFileTreeShortcuts({
      allowUnsafeNavigationOverrides: true,
      bindings: { focusNext: false },
    })
    expect(unsafe.bindings.focusNext).toBeUndefined()
  })

  it("rejects printable navigation aliases that shadow typeahead", () => {
    const result = resolveFileTreeShortcuts({
      bindings: { focusNext: { key: "j" } },
    })

    expect(result.bindings.focusNext).toEqual(
      FILE_TREE_DEFAULT_SHORTCUTS.focusNext
    )
    expect(result.conflicts).toEqual([
      expect.objectContaining({
        commandId: "focusNext",
        reason: "typeahead",
      }),
    ])
  })

  it("rejects common browser shortcuts unless explicitly allowed", () => {
    const safe = resolveFileTreeShortcuts({
      bindings: { refresh: { key: "r", primary: true } },
    })
    expect(safe.bindings.refresh).toBeUndefined()
    expect(safe.conflicts).toEqual([
      expect.objectContaining({ commandId: "refresh", reason: "reserved" }),
    ])

    const optedIn = resolveFileTreeShortcuts({
      allowUnsafeShortcuts: true,
      bindings: { refresh: { key: "r", primary: true } },
    })
    expect(optedIn.bindings.refresh).toEqual([{ key: "r", primary: true }])
  })

  it("selects commands from a deterministic order", () => {
    const resolved = resolveFileTreeShortcuts({
      platform: "windows",
    })
    expect(
      getFileTreeShortcutCommand(
        keyboardEvent("ArrowDown", { shiftKey: true }),
        resolved.bindings,
        FILE_TREE_BASE_COMMAND_ORDER,
        { platform: "windows" }
      )
    ).toBe("extendSelectionNext")
    expect(
      getFileTreeShortcutCommand(
        keyboardEvent("a", { ctrlKey: true }),
        resolved.bindings,
        FILE_TREE_BASE_COMMAND_ORDER,
        { platform: "windows" }
      )
    ).toBe("selectAll")
  })

  it("provides platform-specific application defaults", () => {
    expect(
      resolveFileTreeShortcuts({ platform: "macos" }).bindings.delete
    ).toEqual([expect.objectContaining({ key: "Backspace", primary: true })])
    expect(
      resolveFileTreeShortcuts({ platform: "windows" }).bindings.delete
    ).toEqual([expect.objectContaining({ key: "Delete" })])
  })

  it("reports duplicate, printable, and reserved custom commands", () => {
    const result = validateFileTreeShortcutCommands(
      [
        { id: "duplicate", shortcuts: { key: "ArrowDown" } },
        { id: "printable", shortcuts: { key: "q" } },
        {
          id: "browser-find",
          shortcuts: { key: "f", primary: true },
        },
      ],
      { bindings: resolveFileTreeShortcuts().bindings }
    )

    expect(result.acceptedCommandIds.size).toBe(0)
    expect(result.conflicts.map((conflict) => conflict.reason)).toEqual([
      "duplicate",
      "typeahead",
      "reserved",
    ])
  })

  it("accepts one explicitly scoped printable command", () => {
    const result = validateFileTreeShortcutCommands([
      {
        id: "mark",
        shortcuts: { key: "m" },
        allowTypeaheadConflict: true,
      },
    ])

    expect(result.acceptedCommandIds.has("mark")).toBe(true)
  })

  it("rejects duplicate custom command IDs", () => {
    const result = validateFileTreeShortcutCommands([
      { id: "inspect", shortcuts: { key: "i", alt: true } },
      { id: "inspect", shortcuts: { key: "p", alt: true } },
    ])

    expect(result.acceptedCommandIds.has("inspect")).toBe(false)
    expect(result.conflicts).toEqual([
      expect.objectContaining({
        commandId: "inspect",
        conflictingCommandId: "inspect",
        reason: "duplicate",
      }),
    ])
  })
})

describe("file tree shortcut discoverability", () => {
  it("formats human labels for each platform", () => {
    expect(getFileTreeShortcutLabel("selectAll", { platform: "macos" })).toBe(
      "⌘A"
    )
    expect(getFileTreeShortcutLabel("selectAll", { platform: "windows" })).toBe(
      "Ctrl+A"
    )
    vi.stubGlobal("navigator", undefined)
    expect(getFileTreeShortcutLabel("selectAll")).toBe("Ctrl/Cmd+A")
    vi.unstubAllGlobals()
  })

  it("serializes valid aria-keyshortcuts forms", () => {
    expect(
      getFileTreeAriaKeyShortcuts("selectAll", { platform: "macos" })
    ).toBe("Meta+A")
    expect(
      getFileTreeAriaKeyShortcuts("selectAll", { platform: "windows" })
    ).toBe("Control+A")
    vi.stubGlobal("navigator", undefined)
    expect(getFileTreeAriaKeyShortcuts("selectAll")).toBe("Control+A Meta+A")
    vi.unstubAllGlobals()
  })

  it("does not invoke conflict callbacks from pure resolution", () => {
    const callback = vi.fn()
    const result = resolveFileTreeShortcuts({
      bindings: { focusNext: false },
    })
    result.conflicts.forEach(callback)

    expect(callback).toHaveBeenCalledTimes(1)
  })
})
