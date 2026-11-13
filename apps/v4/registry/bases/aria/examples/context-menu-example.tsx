"use client"

import * as React from "react"
import { Pressable, type Selection } from "react-aria-components"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  ContextMenu,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/bases/aria/ui/context-menu"
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/aria/ui/dialog"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ContextMenuExample() {
  return (
    <ExampleWrapper>
      <ContextMenuBasic />
      <ContextMenuWithIcons />
      <ContextMenuWithSides />
      <ContextMenuWithShortcuts />
      <ContextMenuWithSubmenu />
      <ContextMenuWithGroups />
      <ContextMenuWithCheckboxes />
      <ContextMenuWithRadio />
      <ContextMenuWithDestructive />
      <ContextMenuInDialog />
      <ContextMenuWithInset />
    </ExampleWrapper>
  )
}

function ContextMenuBasic() {
  return (
    <Example title="Basic">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuItem>Back</ContextMenuItem>
            <ContextMenuItem isDisabled>Forward</ContextMenuItem>
            <ContextMenuItem>Reload</ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithIcons() {
  return (
    <Example title="With Icons">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ScissorsIcon"
                tabler="IconCut"
                hugeicons="ScissorIcon"
                phosphor="ScissorsIcon"
                remixicon="RiScissorsLine"
              />
              Cut
            </ContextMenuItem>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ClipboardPasteIcon"
                tabler="IconClipboard"
                hugeicons="ClipboardIcon"
                phosphor="ClipboardIcon"
                remixicon="RiClipboardLine"
              />
              Paste
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuItem>
              Back
              <ContextMenuShortcut>⌘[</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem isDisabled>
              Forward
              <ContextMenuShortcut>⌘]</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Reload
              <ContextMenuShortcut>⌘R</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save As...
              <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithSubmenu() {
  return (
    <Example title="With Submenu">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithGroups() {
  return (
    <Example title="With Groups, Labels & Separators">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuLabel>File</ContextMenuLabel>
            <ContextMenuItem>
              New File
              <ContextMenuShortcut>⌘N</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Open File
              <ContextMenuShortcut>⌘O</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Save
              <ContextMenuShortcut>⌘S</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Edit</ContextMenuLabel>
            <ContextMenuItem>
              Undo
              <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Redo
              <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              Cut
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Copy
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              Paste
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem variant="destructive">
              Delete
              <ContextMenuShortcut>⌫</ContextMenuShortcut>
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithCheckboxes() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["bookmarks-bar", "developer-tools"])
  )

  return (
    <Example title="With Checkboxes">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <ContextMenuItem id="bookmarks-bar">
              Show Bookmarks Bar
            </ContextMenuItem>
            <ContextMenuItem>Show Full URLs</ContextMenuItem>
            <ContextMenuItem id="developer-tools">
              Show Developer Tools
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithRadio() {
  const [user, setUser] = React.useState("pedro")
  const [theme, setTheme] = React.useState("light")

  return (
    <Example title="With Radio Group">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuGroup
              selectionMode="single"
              selectedKeys={[user]}
              onSelectionChange={(keys) =>
                setUser(
                  keys === "all"
                    ? "pedro"
                    : (keys.values().next().value as string)
                )
              }
            >
              <ContextMenuItem id="pedro">Pedro Duarte</ContextMenuItem>
              <ContextMenuItem id="colm">Colm Tuite</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuGroup
              selectionMode="single"
              selectedKeys={theme}
              onSelectionChange={(keys) =>
                setTheme(
                  keys === "all"
                    ? "light"
                    : (keys.values().next().value as string)
                )
              }
            >
              <ContextMenuItem id="light">Light</ContextMenuItem>
              <ContextMenuItem id="dark">Dark</ContextMenuItem>
              <ContextMenuItem id="system">System</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithDestructive() {
  return (
    <Example title="With Destructive Items">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu>
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="PencilIcon"
                tabler="IconPencil"
                hugeicons="EditIcon"
                phosphor="PencilIcon"
                remixicon="RiPencilLine"
              />
              Edit
            </ContextMenuItem>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ShareIcon"
                tabler="IconShare"
                hugeicons="ShareIcon"
                phosphor="ShareIcon"
                remixicon="RiShareLine"
              />
              Share
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ArchiveIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="ArchiveIcon"
                remixicon="RiArchiveLine"
              />
              Archive
            </ContextMenuItem>
            <ContextMenuItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="DeleteIcon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
              Delete
            </ContextMenuItem>
          </ContextMenuGroup>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}

function ContextMenuWithSides() {
  return (
    <Example title="With Sides" containerClassName="col-span-2">
      <div className="flex flex-wrap justify-center gap-2">
        {(
          [
            { label: "start", placement: "start top" },
            { label: "left", placement: "left top" },
            { label: "top", placement: "top start" },
            { label: "bottom", placement: "bottom start" },
            { label: "right", placement: "right top" },
            { label: "end", placement: "end top" },
          ] as const
        ).map(({ label, placement }) => (
          <ContextMenuTrigger key={placement}>
            <Pressable>
              <div
                role="button"
                className="flex aspect-[2/0.5] items-center justify-center rounded-lg border p-4 text-sm capitalize"
              >
                {label}
              </div>
            </Pressable>
            <ContextMenu placement={placement}>
              <ContextMenuGroup>
                <ContextMenuItem>Back</ContextMenuItem>
                <ContextMenuItem>Forward</ContextMenuItem>
                <ContextMenuItem>Reload</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenu>
          </ContextMenuTrigger>
        ))}
      </div>
    </Example>
  )
}

function ContextMenuInDialog() {
  return (
    <Example title="In Dialog">
      <DialogTrigger>
        <Button variant="outline">Open Dialog</Button>
        <Dialog>
          <DialogHeader>
            <DialogTitle>Context Menu Example</DialogTitle>
            <DialogDescription>
              Right click on the area below to see the context menu.
            </DialogDescription>
          </DialogHeader>
          <ContextMenuTrigger>
            <Pressable>
              <div
                role="button"
                className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
              >
                Right click here
              </div>
            </Pressable>
            <ContextMenu>
              <ContextMenuGroup>
                <ContextMenuItem>
                  <IconPlaceholder
                    lucide="CopyIcon"
                    tabler="IconCopy"
                    hugeicons="CopyIcon"
                    phosphor="CopyIcon"
                    remixicon="RiFileCopyLine"
                  />
                  Copy
                </ContextMenuItem>
                <ContextMenuItem>
                  <IconPlaceholder
                    lucide="ScissorsIcon"
                    tabler="IconCut"
                    hugeicons="ScissorIcon"
                    phosphor="ScissorsIcon"
                    remixicon="RiScissorsLine"
                  />
                  Cut
                </ContextMenuItem>
                <ContextMenuItem>
                  <IconPlaceholder
                    lucide="ClipboardPasteIcon"
                    tabler="IconClipboard"
                    hugeicons="ClipboardIcon"
                    phosphor="ClipboardIcon"
                    remixicon="RiClipboardLine"
                  />
                  Paste
                </ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuSub>
                <ContextMenuSubTrigger>More Options</ContextMenuSubTrigger>
                <ContextMenuSubContent>
                  <ContextMenuGroup>
                    <ContextMenuItem>Save Page...</ContextMenuItem>
                    <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                    <ContextMenuItem>Name Window...</ContextMenuItem>
                  </ContextMenuGroup>
                  <ContextMenuSeparator />
                  <ContextMenuGroup>
                    <ContextMenuItem>Developer Tools</ContextMenuItem>
                  </ContextMenuGroup>
                </ContextMenuSubContent>
              </ContextMenuSub>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem variant="destructive">
                  <IconPlaceholder
                    lucide="TrashIcon"
                    tabler="IconTrash"
                    hugeicons="DeleteIcon"
                    phosphor="TrashIcon"
                    remixicon="RiDeleteBinLine"
                  />
                  Delete
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenu>
          </ContextMenuTrigger>
        </Dialog>
      </DialogTrigger>
    </Example>
  )
}

function ContextMenuWithInset() {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set(["bookmarks"])
  )
  const [theme, setTheme] = React.useState("system")

  return (
    <Example title="With Inset">
      <ContextMenuTrigger>
        <Pressable>
          <div
            role="button"
            className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm"
          >
            Right click here
          </div>
        </Pressable>
        <ContextMenu className="w-44">
          <ContextMenuGroup>
            <ContextMenuLabel>Actions</ContextMenuLabel>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="CopyIcon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy
            </ContextMenuItem>
            <ContextMenuItem>
              <IconPlaceholder
                lucide="ScissorsIcon"
                tabler="IconCut"
                hugeicons="ScissorIcon"
                phosphor="ScissorsIcon"
                remixicon="RiScissorsLine"
              />
              Cut
            </ContextMenuItem>
            <ContextMenuItem inset>Paste</ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <ContextMenuLabel inset>Appearance</ContextMenuLabel>
            <ContextMenuItem inset id="bookmarks">
              Bookmarks
            </ContextMenuItem>
            <ContextMenuItem inset id="urls">
              Full URLs
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuGroup
            selectionMode="single"
            selectedKeys={[theme]}
            onSelectionChange={(keys) =>
              setTheme(
                keys === "all"
                  ? "system"
                  : (keys.values().next().value as string)
              )
            }
          >
            <ContextMenuLabel inset>Theme</ContextMenuLabel>
            <ContextMenuItem inset id="light">
              Light
            </ContextMenuItem>
            <ContextMenuItem inset id="dark">
              Dark
            </ContextMenuItem>
            <ContextMenuItem inset id="system">
              System
            </ContextMenuItem>
          </ContextMenuGroup>
          <ContextMenuSeparator />
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>More Options</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenu>
      </ContextMenuTrigger>
    </Example>
  )
}
