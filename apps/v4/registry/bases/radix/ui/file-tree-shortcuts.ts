export type FileTreePlatform = "auto" | "macos" | "windows" | "linux"

export type FileTreeResolvedPlatform = Exclude<FileTreePlatform, "auto">

export const FILE_TREE_BUILTIN_COMMAND_IDS = [
  "focusNext",
  "focusPrevious",
  "focusFirst",
  "focusLast",
  "expandOrFirstChild",
  "collapseOrParent",
  "activate",
  "toggleSelection",
  "extendSelectionNext",
  "extendSelectionPrevious",
  "selectRangeToFocus",
  "selectAll",
  "expandSiblings",
  "openContextMenu",
  "rename",
  "createFile",
  "createFolder",
  "delete",
  "copy",
  "cut",
  "paste",
  "move",
  "showProperties",
  "refresh",
  "focusFilter",
  "pageUp",
  "pageDown",
] as const

export type FileTreeBuiltinCommandId =
  (typeof FILE_TREE_BUILTIN_COMMAND_IDS)[number]

export const FILE_TREE_BASE_COMMAND_ORDER = [
  "extendSelectionNext",
  "extendSelectionPrevious",
  "selectRangeToFocus",
  "selectAll",
  "focusNext",
  "focusPrevious",
  "focusFirst",
  "focusLast",
  "expandOrFirstChild",
  "collapseOrParent",
  "activate",
  "toggleSelection",
  "expandSiblings",
  "openContextMenu",
  "rename",
] as const satisfies readonly FileTreeBuiltinCommandId[]

export const FILE_TREE_REQUIRED_NAVIGATION_COMMAND_IDS = [
  "focusNext",
  "focusPrevious",
  "focusFirst",
  "focusLast",
  "expandOrFirstChild",
  "collapseOrParent",
  "activate",
] as const satisfies readonly FileTreeBuiltinCommandId[]

export interface FileTreeShortcut {
  key: string
  code?: string
  primary?: boolean
  alt?: boolean
  shift?: boolean
  control?: boolean
  meta?: boolean
  allowRepeat?: boolean
  platform?: FileTreeResolvedPlatform | readonly FileTreeResolvedPlatform[]
}

export type FileTreeShortcutBinding =
  | FileTreeShortcut
  | readonly FileTreeShortcut[]
  | false

export interface FileTreeShortcutConfig {
  platform?: FileTreePlatform
  bindings?: Partial<Record<FileTreeBuiltinCommandId, FileTreeShortcutBinding>>
  allowUnsafeNavigationOverrides?: boolean
  allowUnsafeShortcuts?: boolean
  onConflict?: (conflict: FileTreeShortcutConflict) => void
}

export type FileTreeShortcutConflictReason =
  | "duplicate"
  | "reserved"
  | "typeahead"
  | "unsafe-navigation-override"

export interface FileTreeShortcutConflict {
  reason: FileTreeShortcutConflictReason
  commandId: string
  conflictingCommandId?: string
  shortcut?: FileTreeShortcut
  message: string
}

export interface FileTreeShortcutEvent {
  key: string
  code?: string
  altKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
  repeat?: boolean
  isComposing?: boolean
  getModifierState?: (key: string) => boolean
}

export type FileTreeResolvedShortcutMap = Readonly<
  Partial<Record<FileTreeBuiltinCommandId, readonly FileTreeShortcut[]>>
>

export interface FileTreeResolvedShortcuts {
  bindings: FileTreeResolvedShortcutMap
  conflicts: readonly FileTreeShortcutConflict[]
  platform: FileTreeResolvedPlatform | undefined
}

export interface FileTreeShortcutCommandDescriptor {
  id: string
  shortcuts?: FileTreeShortcutBinding
  allowTypeaheadConflict?: boolean
}

const fileTreeProcess = (
  globalThis as typeof globalThis & {
    process?: { env?: { NODE_ENV?: string } }
  }
).process
const isDevelopment = fileTreeProcess?.env?.NODE_ENV !== "production"

const requiredNavigationIds = new Set<string>(
  FILE_TREE_REQUIRED_NAVIGATION_COMMAND_IDS
)

const builtinCommandIds = new Set<string>(FILE_TREE_BUILTIN_COMMAND_IDS)

const DEFAULT_SHORTCUTS: FileTreeResolvedShortcutMap = {
  focusNext: [{ key: "ArrowDown", allowRepeat: true }],
  focusPrevious: [{ key: "ArrowUp", allowRepeat: true }],
  focusFirst: [{ key: "Home", allowRepeat: true }],
  focusLast: [{ key: "End", allowRepeat: true }],
  expandOrFirstChild: [{ key: "ArrowRight", allowRepeat: true }],
  collapseOrParent: [{ key: "ArrowLeft", allowRepeat: true }],
  activate: [{ key: "Enter", allowRepeat: false }],
  toggleSelection: [{ key: " ", allowRepeat: false }],
  extendSelectionNext: [{ key: "ArrowDown", shift: true, allowRepeat: true }],
  extendSelectionPrevious: [{ key: "ArrowUp", shift: true, allowRepeat: true }],
  selectRangeToFocus: [{ key: " ", shift: true, allowRepeat: false }],
  selectAll: [{ key: "a", primary: true, allowRepeat: false }],
  expandSiblings: [
    { key: "*", allowRepeat: false },
    { key: "*", shift: true, allowRepeat: false },
  ],
  openContextMenu: [
    { key: "F10", shift: true, allowRepeat: false },
    { key: "ContextMenu", allowRepeat: false },
  ],
  rename: [{ key: "F2", allowRepeat: false }],
  createFolder: [{ key: "n", primary: true, shift: true, allowRepeat: false }],
  delete: [
    {
      key: "Backspace",
      primary: true,
      allowRepeat: false,
      platform: "macos",
    },
    {
      key: "Delete",
      allowRepeat: false,
      platform: ["windows", "linux"],
    },
  ],
  copy: [{ key: "c", primary: true, allowRepeat: false }],
  cut: [{ key: "x", primary: true, allowRepeat: false }],
  paste: [{ key: "v", primary: true, allowRepeat: false }],
  showProperties: [
    {
      key: "i",
      primary: true,
      allowRepeat: false,
      platform: "macos",
    },
    {
      key: "Enter",
      alt: true,
      allowRepeat: false,
      platform: ["windows", "linux"],
    },
  ],
  pageUp: [{ key: "PageUp", allowRepeat: true }],
  pageDown: [{ key: "PageDown", allowRepeat: true }],
}

export const FILE_TREE_DEFAULT_SHORTCUTS = DEFAULT_SHORTCUTS

function toShortcutArray(
  binding: FileTreeShortcutBinding | undefined
): readonly FileTreeShortcut[] {
  if (!binding) return []
  return Array.isArray(binding) ? binding : [binding as FileTreeShortcut]
}

function supportsPlatform(
  shortcut: FileTreeShortcut,
  platform: FileTreeResolvedPlatform | undefined
) {
  if (!shortcut.platform || !platform) return true

  return Array.isArray(shortcut.platform)
    ? shortcut.platform.includes(platform)
    : shortcut.platform === platform
}

function normalizeKey(key: string) {
  if (key === "Spacebar" || key === "Space") return " "
  return key.length === 1 ? key.toLocaleLowerCase() : key.toLocaleLowerCase()
}

function shortcutKey(shortcut: FileTreeShortcut) {
  return [
    shortcut.primary ? "primary" : "",
    shortcut.control ? "control" : "",
    shortcut.meta ? "meta" : "",
    shortcut.alt ? "alt" : "",
    shortcut.shift ? "shift" : "",
    shortcut.code
      ? `code:${shortcut.code}`
      : `key:${normalizeKey(shortcut.key)}`,
  ]
    .filter(Boolean)
    .join("+")
}

function isPrimaryPressed(
  event: FileTreeShortcutEvent,
  platform: FileTreeResolvedPlatform | undefined
) {
  if (platform === "macos") return event.metaKey && !event.ctrlKey
  if (platform === "windows" || platform === "linux") {
    return event.ctrlKey && !event.metaKey
  }

  return event.ctrlKey !== event.metaKey
}

function matchesModifiers(
  event: FileTreeShortcutEvent,
  shortcut: FileTreeShortcut,
  platform: FileTreeResolvedPlatform | undefined
) {
  if (shortcut.primary && !isPrimaryPressed(event, platform)) return false

  const expectedControl = shortcut.control ?? false
  const expectedMeta = shortcut.meta ?? false

  if (!shortcut.primary) {
    if (event.ctrlKey !== expectedControl || event.metaKey !== expectedMeta) {
      return false
    }
  } else {
    if (shortcut.control && !event.ctrlKey) return false
    if (shortcut.meta && !event.metaKey) return false
  }

  return (
    event.altKey === (shortcut.alt ?? false) &&
    event.shiftKey === (shortcut.shift ?? false)
  )
}

export function isFileTreeAltGraphEvent(event: FileTreeShortcutEvent) {
  return event.getModifierState?.("AltGraph") === true
}

export function matchFileTreeShortcut(
  event: FileTreeShortcutEvent,
  binding: FileTreeShortcutBinding | undefined,
  options: {
    platform?: FileTreePlatform | FileTreeResolvedPlatform
  } = {}
) {
  if (!binding || event.isComposing || isFileTreeAltGraphEvent(event)) {
    return false
  }

  const platform =
    options.platform === "auto"
      ? resolveFileTreePlatform("auto")
      : options.platform

  return toShortcutArray(binding).some((shortcut) => {
    if (!supportsPlatform(shortcut, platform)) return false
    if (event.repeat && shortcut.allowRepeat === false) return false
    if (
      shortcut.code
        ? event.code !== shortcut.code
        : normalizeKey(event.key) !== normalizeKey(shortcut.key)
    ) {
      return false
    }

    return matchesModifiers(event, shortcut, platform)
  })
}

export function resolveFileTreePlatform(
  platform: FileTreePlatform = "auto"
): FileTreeResolvedPlatform | undefined {
  if (platform !== "auto") return platform
  if (typeof navigator === "undefined") return undefined

  const navigatorWithUserAgentData = navigator as Navigator & {
    userAgentData?: { platform?: string }
  }
  const value = (
    navigatorWithUserAgentData.userAgentData?.platform ??
    navigator.platform ??
    ""
  ).toLocaleLowerCase()

  if (
    value.includes("mac") ||
    value.includes("iphone") ||
    value.includes("ipad")
  ) {
    return "macos"
  }
  if (value.includes("win")) return "windows"
  if (value.includes("linux") || value.includes("android")) return "linux"
  return undefined
}

function isReservedShortcut(shortcut: FileTreeShortcut) {
  const key = normalizeKey(shortcut.key)
  return (
    (shortcut.primary && (key === "f" || key === "r")) ||
    (!shortcut.primary &&
      !shortcut.control &&
      !shortcut.meta &&
      !shortcut.alt &&
      !shortcut.shift &&
      key === "f5")
  )
}

function isUnmodifiedPrintableShortcut(shortcut: FileTreeShortcut) {
  return (
    shortcut.key.length === 1 &&
    !shortcut.primary &&
    !shortcut.control &&
    !shortcut.meta &&
    !shortcut.alt &&
    !shortcut.shift
  )
}

function filterForPlatform(
  shortcuts: readonly FileTreeShortcut[],
  platform: FileTreeResolvedPlatform | undefined
) {
  return shortcuts.filter((shortcut) => supportsPlatform(shortcut, platform))
}

export function resolveFileTreeShortcuts(
  config: Omit<FileTreeShortcutConfig, "onConflict"> = {}
): FileTreeResolvedShortcuts {
  const platform = resolveFileTreePlatform(config.platform)
  const conflicts: FileTreeShortcutConflict[] = []
  const bindings: Partial<
    Record<FileTreeBuiltinCommandId, readonly FileTreeShortcut[]>
  > = {}
  const acceptOverride = (
    commandId: FileTreeBuiltinCommandId,
    shortcut: FileTreeShortcut
  ) => {
    if (config.allowUnsafeShortcuts) return true

    if (isReservedShortcut(shortcut)) {
      conflicts.push({
        reason: "reserved",
        commandId,
        shortcut,
        message: `The "${commandId}" shortcut conflicts with a common browser shortcut. Set allowUnsafeShortcuts to opt in.`,
      })
      return false
    }

    if (isUnmodifiedPrintableShortcut(shortcut)) {
      conflicts.push({
        reason: "typeahead",
        commandId,
        shortcut,
        message: `The "${commandId}" shortcut conflicts with tree typeahead. Set allowUnsafeShortcuts to opt in.`,
      })
      return false
    }

    return true
  }

  for (const commandId of FILE_TREE_BUILTIN_COMMAND_IDS) {
    const defaults = filterForPlatform(
      DEFAULT_SHORTCUTS[commandId] ?? [],
      platform
    )
    const override = config.bindings?.[commandId]

    if (override === undefined) {
      if (defaults.length > 0) bindings[commandId] = defaults
      continue
    }

    if (
      requiredNavigationIds.has(commandId) &&
      !config.allowUnsafeNavigationOverrides
    ) {
      if (override === false) {
        conflicts.push({
          reason: "unsafe-navigation-override",
          commandId,
          message: `The required "${commandId}" navigation command cannot be disabled without allowUnsafeNavigationOverrides.`,
        })
        bindings[commandId] = defaults
        continue
      }

      bindings[commandId] = [
        ...defaults,
        ...filterForPlatform(toShortcutArray(override), platform).filter(
          (shortcut) => acceptOverride(commandId, shortcut)
        ),
      ]
      continue
    }

    const accepted = filterForPlatform(
      toShortcutArray(override),
      platform
    ).filter((shortcut) => acceptOverride(commandId, shortcut))

    if (accepted.length > 0) bindings[commandId] = accepted
  }

  const occupied = new Map<string, string>()
  for (const commandId of FILE_TREE_BUILTIN_COMMAND_IDS) {
    for (const shortcut of bindings[commandId] ?? []) {
      const key = shortcutKey(shortcut)
      const previous = occupied.get(key)
      if (previous && previous !== commandId) {
        conflicts.push({
          reason: "duplicate",
          commandId,
          conflictingCommandId: previous,
          shortcut,
          message: `The "${commandId}" shortcut duplicates the "${previous}" shortcut. The documented command order wins.`,
        })
      } else {
        occupied.set(key, commandId)
      }
    }
  }

  return { bindings, conflicts, platform }
}

export function resolveFileTreeShortcutMap(
  defaults: FileTreeResolvedShortcutMap = FILE_TREE_DEFAULT_SHORTCUTS,
  overrides: Partial<
    Record<FileTreeBuiltinCommandId, FileTreeShortcutBinding>
  > = {},
  options: Omit<FileTreeShortcutConfig, "bindings" | "onConflict"> = {}
): FileTreeResolvedShortcutMap {
  if (defaults !== FILE_TREE_DEFAULT_SHORTCUTS) {
    const bindings = { ...defaults }
    for (const commandId of FILE_TREE_BUILTIN_COMMAND_IDS) {
      const override = overrides[commandId]
      if (override === undefined) continue
      const shortcuts = toShortcutArray(override)
      if (shortcuts.length > 0) bindings[commandId] = shortcuts
      else delete bindings[commandId]
    }
    return bindings
  }

  return resolveFileTreeShortcuts({ ...options, bindings: overrides }).bindings
}

export function getFileTreeShortcutCommand(
  event: FileTreeShortcutEvent,
  bindings: FileTreeResolvedShortcutMap,
  commandOrder: readonly FileTreeBuiltinCommandId[] = FILE_TREE_BASE_COMMAND_ORDER,
  options: {
    platform?: FileTreePlatform | FileTreeResolvedPlatform
  } = {}
): FileTreeBuiltinCommandId | undefined {
  return commandOrder.find((commandId) =>
    matchFileTreeShortcut(event, bindings[commandId], options)
  )
}

export function validateFileTreeShortcutCommands(
  commands: readonly FileTreeShortcutCommandDescriptor[],
  options: {
    bindings?: FileTreeResolvedShortcutMap
    occupiedCommandIds?: readonly FileTreeBuiltinCommandId[]
    allowUnsafeShortcuts?: boolean
  } = {}
) {
  const conflicts: FileTreeShortcutConflict[] = []
  const occupied = new Map<string, string>()
  const bindings = options.bindings ?? FILE_TREE_DEFAULT_SHORTCUTS
  const occupiedIds = options.occupiedCommandIds ?? FILE_TREE_BASE_COMMAND_ORDER

  for (const commandId of occupiedIds) {
    for (const shortcut of bindings[commandId] ?? []) {
      occupied.set(shortcutKey(shortcut), commandId)
    }
  }

  const acceptedCommandIds = new Set<string>()
  const seenCommandIds = new Set<string>()

  for (const command of commands) {
    if (seenCommandIds.has(command.id)) {
      acceptedCommandIds.delete(command.id)
      conflicts.push({
        reason: "duplicate",
        commandId: command.id,
        conflictingCommandId: command.id,
        message: `Custom command IDs must be unique. The "${command.id}" command is declared more than once.`,
      })
      continue
    }
    seenCommandIds.add(command.id)

    const fallback = builtinCommandIds.has(command.id)
      ? bindings[command.id as FileTreeBuiltinCommandId]
      : undefined
    const shortcuts = toShortcutArray(command.shortcuts ?? fallback)
    let accepted = shortcuts.length > 0

    for (const shortcut of shortcuts) {
      if (
        !command.allowTypeaheadConflict &&
        isUnmodifiedPrintableShortcut(shortcut)
      ) {
        conflicts.push({
          reason: "typeahead",
          commandId: command.id,
          shortcut,
          message: `The "${command.id}" shortcut conflicts with tree typeahead.`,
        })
        accepted = false
        continue
      }

      if (!options.allowUnsafeShortcuts && isReservedShortcut(shortcut)) {
        conflicts.push({
          reason: "reserved",
          commandId: command.id,
          shortcut,
          message: `The "${command.id}" shortcut conflicts with a common browser shortcut.`,
        })
        accepted = false
        continue
      }

      const key = shortcutKey(shortcut)
      const previous = occupied.get(key)
      if (previous && previous !== command.id) {
        conflicts.push({
          reason: "duplicate",
          commandId: command.id,
          conflictingCommandId: previous,
          shortcut,
          message: `The "${command.id}" shortcut duplicates the "${previous}" shortcut.`,
        })
        accepted = false
      }
    }

    if (!accepted) continue

    acceptedCommandIds.add(command.id)
    shortcuts.forEach((shortcut) =>
      occupied.set(shortcutKey(shortcut), command.id)
    )
  }

  return { acceptedCommandIds, conflicts }
}

function keyLabel(key: string) {
  const normalized = normalizeKey(key)
  const labels: Record<string, string> = {
    " ": "Space",
    arrowdown: "↓",
    arrowleft: "←",
    arrowright: "→",
    arrowup: "↑",
    backspace: "Backspace",
    contextmenu: "Menu",
    delete: "Delete",
    end: "End",
    enter: "Enter",
    escape: "Esc",
    home: "Home",
    pagedown: "Page Down",
    pageup: "Page Up",
  }

  return (
    labels[normalized] ?? (key.length === 1 ? key.toLocaleUpperCase() : key)
  )
}

function formatShortcut(
  shortcut: FileTreeShortcut,
  platform: FileTreeResolvedPlatform | undefined
) {
  const key = keyLabel(shortcut.key)

  if (platform === "macos") {
    return [
      shortcut.control ? "⌃" : "",
      shortcut.alt ? "⌥" : "",
      shortcut.shift ? "⇧" : "",
      shortcut.primary || shortcut.meta ? "⌘" : "",
      key,
    ]
      .filter(Boolean)
      .join("")
  }

  const modifiers = [
    shortcut.primary
      ? platform
        ? "Ctrl"
        : "Ctrl/Cmd"
      : shortcut.control
        ? "Ctrl"
        : "",
    shortcut.meta ? (platform ? "Meta" : "Cmd") : "",
    shortcut.alt ? "Alt" : "",
    shortcut.shift ? "Shift" : "",
  ].filter(Boolean)

  return [...modifiers, key].join("+")
}

export function getFileTreeShortcutLabel(
  commandId: FileTreeBuiltinCommandId,
  options: {
    platform?: FileTreePlatform
    bindings?: FileTreeResolvedShortcutMap
  } = {}
) {
  const platform = resolveFileTreePlatform(options.platform)
  const bindings =
    options.bindings ??
    resolveFileTreeShortcuts({ platform: options.platform }).bindings

  return (bindings[commandId] ?? [])
    .filter((shortcut) => supportsPlatform(shortcut, platform))
    .map((shortcut) => formatShortcut(shortcut, platform))
    .join(" / ")
}

function ariaShortcut(
  shortcut: FileTreeShortcut,
  platform: FileTreeResolvedPlatform | undefined
) {
  const key =
    shortcut.key === " "
      ? "Space"
      : shortcut.key.length === 1
        ? shortcut.key.toLocaleUpperCase()
        : shortcut.key
  const baseModifiers = [
    shortcut.control ? "Control" : "",
    shortcut.meta ? "Meta" : "",
    shortcut.alt ? "Alt" : "",
    shortcut.shift ? "Shift" : "",
  ].filter(Boolean)

  if (!shortcut.primary) return [...baseModifiers, key].join("+")

  if (platform === "macos") return [...baseModifiers, "Meta", key].join("+")
  if (platform === "windows" || platform === "linux") {
    return [...baseModifiers, "Control", key].join("+")
  }

  return [
    [...baseModifiers, "Control", key].join("+"),
    [...baseModifiers, "Meta", key].join("+"),
  ]
}

export function getFileTreeAriaKeyShortcuts(
  commandId: FileTreeBuiltinCommandId,
  options: {
    platform?: FileTreePlatform
    bindings?: FileTreeResolvedShortcutMap
  } = {}
) {
  const platform = resolveFileTreePlatform(options.platform)
  const bindings =
    options.bindings ??
    resolveFileTreeShortcuts({ platform: options.platform }).bindings

  return (bindings[commandId] ?? [])
    .filter((shortcut) => supportsPlatform(shortcut, platform))
    .flatMap((shortcut) => ariaShortcut(shortcut, platform))
    .join(" ")
}

export function warnFileTreeShortcutConflicts(
  conflicts: readonly FileTreeShortcutConflict[]
) {
  if (!isDevelopment) return
  conflicts.forEach((conflict) =>
    console.warn(`[FileTree] ${conflict.message}`)
  )
}
