"use client"

import * as React from "react"

import { Button } from "@/styles/radix-nova/ui/button"
import {
  FileTree,
  getFileTreeAriaKeyShortcuts,
  getFileTreeShortcutLabel,
  type FileTreeBuiltinCommandId,
  type FileTreeCommand,
  type FileTreeNode,
  type FileTreePlatform,
} from "@/styles/radix-nova/ui/file-tree"

const items: FileTreeNode[] = [
  {
    id: "app",
    name: "app",
    type: "folder",
    children: [
      { id: "page", name: "page.tsx", type: "file" },
      { id: "layout", name: "layout.tsx", type: "file" },
    ],
  },
  { id: "package", name: "package.json", type: "file" },
]

const shortcutRows: Array<{
  command: FileTreeBuiltinCommandId
  label: string
}> = [
  { command: "activate", label: "Open" },
  { command: "rename", label: "Rename" },
  { command: "selectAll", label: "Select all" },
  { command: "createFolder", label: "New folder" },
  { command: "openContextMenu", label: "Context menu" },
]

function ShortcutHelp({ platform }: { platform: FileTreePlatform }) {
  return (
    <dl className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
      {shortcutRows.map(({ command, label }) => (
        <React.Fragment key={command}>
          <dt className="text-muted-foreground">{label}</dt>
          <dd>
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">
              {getFileTreeShortcutLabel(command, { platform }) || "Unbound"}
            </kbd>
          </dd>
        </React.Fragment>
      ))}
    </dl>
  )
}

export function FileTreeShortcutsDemo() {
  const [platform, setPlatform] =
    React.useState<Exclude<FileTreePlatform, "auto">>("macos")
  const [message, setMessage] = React.useState("No command run yet.")

  const commands = React.useMemo<readonly FileTreeCommand<FileTreeNode>[]>(
    () => [
      {
        id: "createFolder",
        label: "New folder",
        run: ({ focusedItem }) => {
          setMessage(
            focusedItem
              ? `Create a folder beside ${focusedItem.name}`
              : "Create a folder at the root"
          )
        },
      },
    ],
    []
  )

  const runNewFolder = () => {
    setMessage("Create a folder from the visible command")
  }

  return (
    <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-[1fr_14rem]">
      <div className="space-y-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={platform === "macos" ? "default" : "outline"}
            onClick={() => setPlatform("macos")}
          >
            macOS
          </Button>
          <Button
            size="sm"
            variant={platform === "windows" ? "default" : "outline"}
            onClick={() => setPlatform("windows")}
          >
            Windows/Linux
          </Button>
        </div>
        <FileTree
          aria-label="Project files"
          className="border p-2"
          commands={commands}
          currentId="page"
          defaultExpandedIds={["app"]}
          items={items}
          onRename={async () => undefined}
          shortcuts={{ platform }}
        />
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {message}
        </p>
      </div>
      <div className="space-y-3 rounded-md border p-3">
        <div>
          <h4 className="text-sm font-medium">Keyboard shortcuts</h4>
          <p className="text-xs text-muted-foreground">
            Labels follow the selected platform.
          </p>
        </div>
        <ShortcutHelp platform={platform} />
        <Button
          className="w-full"
          size="sm"
          variant="outline"
          aria-keyshortcuts={getFileTreeAriaKeyShortcuts("createFolder", {
            platform,
          })}
          onClick={runNewFolder}
        >
          New folder
        </Button>
      </div>
    </div>
  )
}
