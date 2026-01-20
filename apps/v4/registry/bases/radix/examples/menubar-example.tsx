"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/radix/ui/dialog"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/bases/radix/ui/menubar"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function MenubarExample() {
  return (
    <ExampleWrapper>
      <MenubarBasic />
      <MenubarWithSubmenu />
      <MenubarWithCheckboxes />
      <MenubarWithRadio />
      <MenubarWithIcons />
      <MenubarWithShortcuts />
      <MenubarFormat />
      <MenubarInsert />
      <MenubarDestructive />
      <MenubarInDialog />
    </ExampleWrapper>
  )
}

function MenubarBasic() {
  return (
    <Example title="Basic">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>New Incognito Window</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarWithSubmenu() {
  return (
    <Example title="With Submenu">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                  <MenubarItem>Notes</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Find...</MenubarItem>
                  <MenubarItem>Find Next</MenubarItem>
                  <MenubarItem>Find Previous</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>Cut</MenubarItem>
              <MenubarItem>Copy</MenubarItem>
              <MenubarItem>Paste</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarWithCheckboxes() {
  return (
    <Example title="With Checkboxes">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className="w-64">
            <MenubarGroup>
              <MenubarCheckboxItem>
                Always Show Bookmarks Bar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem checked>
                Always Show Full URLs
              </MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>
                Reload <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled inset>
                Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
            <MenubarCheckboxItem>Code</MenubarCheckboxItem>
            <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarWithRadio() {
  const [user, setUser] = React.useState("benoit")
  const [theme, setTheme] = React.useState("system")

  return (
    <Example title="With Radio">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={user} onValueChange={setUser}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>Edit...</MenubarItem>
              <MenubarItem inset>Add Profile...</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Theme</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={setTheme}>
              <MenubarRadioItem value="light">Light</MenubarRadioItem>
              <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
              <MenubarRadioItem value="system">System</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarWithIcons() {
  return (
    <Example title="With Icons">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="FileIcon"
                  tabler="IconFile"
                  hugeicons="FileIcon"
                  phosphor="FileIcon"
                  remixicon="RiFileLine"
                />
                New File <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="FolderIcon"
                  tabler="IconFolder"
                  hugeicons="FolderIcon"
                  phosphor="FolderIcon"
                  remixicon="RiFolderLine"
                />
                Open Folder
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="SaveIcon"
                  tabler="IconDeviceFloppy"
                  hugeicons="FloppyDiskIcon"
                  phosphor="FloppyDiskIcon"
                  remixicon="RiSaveLine"
                />
                Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>More</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="CircleDashedIcon"
                  tabler="IconCircleDashed"
                  hugeicons="DashedLineCircleIcon"
                  phosphor="CircleDashedIcon"
                  remixicon="RiLoaderLine"
                />
                Settings
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="CircleDashedIcon"
                  tabler="IconCircleDashed"
                  hugeicons="DashedLineCircleIcon"
                  phosphor="CircleDashedIcon"
                  remixicon="RiLoaderLine"
                />
                Help
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <IconPlaceholder
                  lucide="CircleDashedIcon"
                  tabler="IconCircleDashed"
                  hugeicons="DashedLineCircleIcon"
                  phosphor="CircleDashedIcon"
                  remixicon="RiLoaderLine"
                />
                Delete
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarWithShortcuts() {
  return (
    <Example title="With Shortcuts">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Paste <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarFormat() {
  return (
    <Example title="Format">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="BoldIcon"
                  tabler="IconBold"
                  hugeicons="TextBoldIcon"
                  phosphor="TextBIcon"
                  remixicon="RiBold"
                />
                Bold <MenubarShortcut>⌘B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="ItalicIcon"
                  tabler="IconItalic"
                  hugeicons="TextItalicIcon"
                  phosphor="TextItalicIcon"
                  remixicon="RiItalic"
                />
                Italic <MenubarShortcut>⌘I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="UnderlineIcon"
                  tabler="IconUnderline"
                  hugeicons="TextUnderlineIcon"
                  phosphor="TextUnderlineIcon"
                  remixicon="RiUnderline"
                />
                Underline <MenubarShortcut>⌘U</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
              <MenubarCheckboxItem>Code</MenubarCheckboxItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Show Ruler</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>Show Grid</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem inset>Zoom In</MenubarItem>
              <MenubarItem inset>Zoom Out</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarInsert() {
  return (
    <Example title="Insert">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Insert</MenubarTrigger>
          <MenubarContent>
            <MenubarSub>
              <MenubarSubTrigger>
                <IconPlaceholder
                  lucide="ImageIcon"
                  tabler="IconPhoto"
                  hugeicons="ImageIcon"
                  phosphor="ImageIcon"
                  remixicon="RiImageLine"
                />
                Media
              </MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem>Image</MenubarItem>
                  <MenubarItem>Video</MenubarItem>
                  <MenubarItem>Audio</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="LinkIcon"
                  tabler="IconLink"
                  hugeicons="LinkIcon"
                  phosphor="LinkIcon"
                  remixicon="RiLinksLine"
                />
                Link <MenubarShortcut>⌘K</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="TableIcon"
                  tabler="IconTable"
                  hugeicons="TableIcon"
                  phosphor="TableIcon"
                  remixicon="RiTableLine"
                />
                Table
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Tools</MenubarTrigger>
          <MenubarContent className="w-44">
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="SearchIcon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
                Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="CheckIcon"
                  tabler="IconCheck"
                  hugeicons="Tick02Icon"
                  phosphor="CheckIcon"
                  remixicon="RiCheckLine"
                />
                Spell Check
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarDestructive() {
  return (
    <Example title="Destructive">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent className="w-40">
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="FileIcon"
                  tabler="IconFile"
                  hugeicons="FileIcon"
                  phosphor="FileIcon"
                  remixicon="RiFileLine"
                />
                New File <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="FolderIcon"
                  tabler="IconFolder"
                  hugeicons="FolderIcon"
                  phosphor="FolderIcon"
                  remixicon="RiFolderLine"
                />
                Open Folder
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem variant="destructive">
                <IconPlaceholder
                  lucide="TrashIcon"
                  tabler="IconTrash"
                  hugeicons="DeleteIcon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine"
                />
                Delete File <MenubarShortcut>⌘⌫</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Account</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                Profile
              </MenubarItem>
              <MenubarItem>
                <IconPlaceholder
                  lucide="SettingsIcon"
                  tabler="IconSettings"
                  hugeicons="SettingsIcon"
                  phosphor="GearIcon"
                  remixicon="RiSettingsLine"
                />
                Settings
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem variant="destructive">
                <IconPlaceholder
                  lucide="LogOutIcon"
                  tabler="IconLogout"
                  hugeicons="LogoutIcon"
                  phosphor="SignOutIcon"
                  remixicon="RiLogoutBoxLine"
                />
                Sign out
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem variant="destructive">
                <IconPlaceholder
                  lucide="TrashIcon"
                  tabler="IconTrash"
                  hugeicons="DeleteIcon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine"
                />
                Delete
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}

function MenubarInDialog() {
  return (
    <Example title="In Dialog">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Menubar Example</DialogTitle>
            <DialogDescription>
              Use the menubar below to see the menu options.
            </DialogDescription>
          </DialogHeader>
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>
                    <IconPlaceholder
                      lucide="CopyIcon"
                      tabler="IconCopy"
                      hugeicons="CopyIcon"
                      phosphor="CopyIcon"
                      remixicon="RiFileCopyLine"
                    />
                    Copy
                  </MenubarItem>
                  <MenubarItem>
                    <IconPlaceholder
                      lucide="ScissorsIcon"
                      tabler="IconCut"
                      hugeicons="ScissorIcon"
                      phosphor="ScissorsIcon"
                      remixicon="RiScissorsLine"
                    />
                    Cut
                  </MenubarItem>
                  <MenubarItem>
                    <IconPlaceholder
                      lucide="ClipboardPasteIcon"
                      tabler="IconClipboard"
                      hugeicons="ClipboardIcon"
                      phosphor="ClipboardIcon"
                      remixicon="RiClipboardLine"
                    />
                    Paste
                  </MenubarItem>
                </MenubarGroup>
                <MenubarSeparator />
                <MenubarSub>
                  <MenubarSubTrigger>More Options</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarGroup>
                      <MenubarItem>Save Page...</MenubarItem>
                      <MenubarItem>Create Shortcut...</MenubarItem>
                      <MenubarItem>Name Window...</MenubarItem>
                    </MenubarGroup>
                    <MenubarSeparator />
                    <MenubarGroup>
                      <MenubarItem>Developer Tools</MenubarItem>
                    </MenubarGroup>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem variant="destructive">
                    <IconPlaceholder
                      lucide="TrashIcon"
                      tabler="IconTrash"
                      hugeicons="DeleteIcon"
                      phosphor="TrashIcon"
                      remixicon="RiDeleteBinLine"
                    />
                    Delete
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
              <MenubarTrigger>Edit</MenubarTrigger>
              <MenubarContent>
                <MenubarGroup>
                  <MenubarItem>
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                  </MenubarItem>
                </MenubarGroup>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </DialogContent>
      </Dialog>
    </Example>
  )
}
