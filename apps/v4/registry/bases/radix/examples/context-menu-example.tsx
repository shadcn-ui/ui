import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
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
import { IconPlaceholder } from "@/app/(design)/components/icon-placeholder"

export default function ContextMenuExample() {
  return (
    <ExampleWrapper>
      <ContextMenuBasic />
      <ContextMenuWithIcons />
      <ContextMenuWithShortcuts />
      <ContextMenuWithSubmenu />
      <ContextMenuWithGroups />
      <ContextMenuWithCheckboxes />
      <ContextMenuWithRadio />
      <ContextMenuWithDestructive />
    </ExampleWrapper>
  )
}

function ContextMenuBasic() {
  return (
    <Example title="Basic">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem disabled>Forward</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithIcons() {
  return (
    <Example title="With Icons">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
    </Example>
  )
}

function ContextMenuWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
    </Example>
  )
}

function ContextMenuWithSubmenu() {
  return (
    <Example title="With Submenu">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
    </Example>
  )
}

function ContextMenuWithGroups() {
  return (
    <Example title="With Groups, Labels & Separators">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
    </Example>
  )
}

function ContextMenuWithCheckboxes() {
  return (
    <Example title="With Checkboxes">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
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
    </Example>
  )
}

function ContextMenuWithRadio() {
  return (
    <Example title="With Radio Group">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuRadioGroup value="pedro">
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem value="pedro">
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
          <ContextMenuSeparator />
          <ContextMenuRadioGroup value="light">
            <ContextMenuLabel>Theme</ContextMenuLabel>
            <ContextMenuRadioItem value="light">Light</ContextMenuRadioItem>
            <ContextMenuRadioItem value="dark">Dark</ContextMenuRadioItem>
            <ContextMenuRadioItem value="system">System</ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuContent>
      </ContextMenu>
    </Example>
  )
}

function ContextMenuWithDestructive() {
  return (
    <Example title="With Destructive Items">
      <ContextMenu>
        <ContextMenuTrigger className="flex aspect-[2/0.5] w-full items-center justify-center rounded-lg border text-sm">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="PencilIcon"
              tabler="IconPencil"
              hugeicons="EditIcon"
            />
            Edit
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ShareIcon"
              tabler="IconShare"
              hugeicons="ShareIcon"
            />
            Share
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ArchiveIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
            />
            Archive
          </ContextMenuItem>
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
    </Example>
  )
}
