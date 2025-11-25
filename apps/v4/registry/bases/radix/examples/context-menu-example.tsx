import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/registry/bases/radix/ui/context-menu"
import Frame from "@/app/(design)/design/components/frame"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function ContextMenuExample() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-6 lg:p-12">
      <div className="flex w-full max-w-lg flex-col gap-12">
        <ContextMenuBasic />
        <ContextMenuWithIcons />
        <ContextMenuWithShortcuts />
        <ContextMenuWithSubmenu />
        <ContextMenuWithGroups />
        <ContextMenuWithCheckboxes />
        <ContextMenuWithRadio />
      </div>
    </div>
  )
}

function ContextMenuBasic() {
  return (
    <Frame title="Basic">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem disabled>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithIcons() {
  return (
    <Frame title="With Icons">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="CopyIcon"
            />
            Copy
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ScissorsIcon"
              tabler="IconCut"
              hugeicons="ScissorIcon"
            />
            Cut
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ClipboardPasteIcon"
              tabler="IconClipboard"
              hugeicons="ClipboardIcon"
            />
            Paste
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="DeleteIcon"
            />
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithShortcuts() {
  return (
    <Frame title="With Shortcuts">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Back
            <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            Forward
            <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Save
            <ContextMenuShortcut>⌘S</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Save As...
            <ContextMenuShortcut>⇧⌘S</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithSubmenu() {
  return (
    <Frame title="With Submenu">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            Cut
            <ContextMenuShortcut>⌘X</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent>
              <ContextMenuItem>Save Page...</ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem>Developer Tools</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithGroups() {
  return (
    <Frame title="With Groups, Labels & Separators">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
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
            <ContextMenuSeparator />
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
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithCheckboxes() {
  return (
    <Frame title="With Checkboxes">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuCheckboxItem checked>
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show Full URLs</ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem checked>
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}

function ContextMenuWithRadio() {
  return (
    <Frame title="With Radio Group">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-video w-full items-center justify-center text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel inset>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="light">
            <ContextMenuLabel inset>Theme</ContextMenuLabel>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Frame>
  )
}
