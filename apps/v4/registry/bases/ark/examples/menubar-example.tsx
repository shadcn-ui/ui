"use client"

import * as React from "react"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/ark/components/example"
import { Button } from "@/registry/bases/ark/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/bases/ark/ui/dialog"
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/registry/bases/ark/ui/menubar"
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
      <MenubarWithInset />
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
              <MenubarItem value="menu-item1">
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item2">
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled value="new-incognito-window">New Incognito Window</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item3">
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem value="menu-item4">
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item5">
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item6">Cut</MenubarItem>
              <MenubarItem value="menu-item7">Copy</MenubarItem>
              <MenubarItem value="menu-item8">Paste</MenubarItem>
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
                  <MenubarItem value="menu-item9">Email link</MenubarItem>
                  <MenubarItem value="menu-item10">Messages</MenubarItem>
                  <MenubarItem value="menu-item11">Notes</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item12">
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem value="menu-item13">
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item14">
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Find</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem value="menu-item15">Find...</MenubarItem>
                  <MenubarItem value="menu-item16">Find Next</MenubarItem>
                  <MenubarItem value="menu-item17">Find Previous</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item18">Cut</MenubarItem>
              <MenubarItem value="menu-item19">Copy</MenubarItem>
              <MenubarItem value="menu-item20">Paste</MenubarItem>
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
              <MenubarCheckboxItem checked value="cb-1">
                Always Show Bookmarks Bar
              </MenubarCheckboxItem>
              <MenubarCheckboxItem value="cb-show-urls" checked>
                Always Show Full URLs
              </MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="reload" inset>
                Reload <MenubarShortcut>⌘R</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="force-reload" disabled inset>
                Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Format</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem value="cb-strikethrough" checked>Strikethrough</MenubarCheckboxItem>
            <MenubarCheckboxItem checked value="cb-2">Code</MenubarCheckboxItem>
            <MenubarCheckboxItem checked value="cb-3">Superscript</MenubarCheckboxItem>
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
            <MenubarRadioGroup value={user} onValueChange={(details) => setUser(details.value)}>
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="edit" inset>Edit...</MenubarItem>
              <MenubarItem value="add" inset>Add Profile...</MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Theme</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value={theme} onValueChange={(details) => setTheme(details.value)}>
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
              <MenubarItem value="menu-item21">
                <IconPlaceholder
                  lucide="FileIcon"
                  tabler="IconFile"
                  hugeicons="FileIcon"
                  phosphor="FileIcon"
                  remixicon="RiFileLine"
                />
                New File <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item22">
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
              <MenubarItem value="menu-item23">
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
              <MenubarItem value="menu-item24">
                <IconPlaceholder
                  lucide="CircleDashedIcon"
                  tabler="IconCircleDashed"
                  hugeicons="DashedLineCircleIcon"
                  phosphor="CircleDashedIcon"
                  remixicon="RiLoaderLine"
                />
                Settings
              </MenubarItem>
              <MenubarItem value="menu-item25">
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
              <MenubarItem value="delete-more" variant="destructive">
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
              <MenubarItem value="menu-item26">
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item27">
                New Window <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item28">
                Print... <MenubarShortcut>⌘P</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem value="menu-item29">
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item30">
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item31">
                Cut <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item32">
                Copy <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item33">
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
              <MenubarItem value="menu-item34">
                <IconPlaceholder
                  lucide="BoldIcon"
                  tabler="IconBold"
                  hugeicons="TextBoldIcon"
                  phosphor="TextBIcon"
                  remixicon="RiBold"
                />
                Bold <MenubarShortcut>⌘B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item35">
                <IconPlaceholder
                  lucide="ItalicIcon"
                  tabler="IconItalic"
                  hugeicons="TextItalicIcon"
                  phosphor="TextItalicIcon"
                  remixicon="RiItalic"
                />
                Italic <MenubarShortcut>⌘I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item36">
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
              <MenubarCheckboxItem value="cb-strikethrough-2" checked>Strikethrough</MenubarCheckboxItem>
              <MenubarCheckboxItem checked value="cb-4">Code</MenubarCheckboxItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem checked value="cb-5">Show Ruler</MenubarCheckboxItem>
            <MenubarCheckboxItem value="cb-show-grid" checked>Show Grid</MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="zoom-in" inset>Zoom In</MenubarItem>
              <MenubarItem value="zoom-out" inset>Zoom Out</MenubarItem>
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
                  <MenubarItem value="menu-item37">Image</MenubarItem>
                  <MenubarItem value="menu-item38">Video</MenubarItem>
                  <MenubarItem value="menu-item39">Audio</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarItem value="menu-item40">
                <IconPlaceholder
                  lucide="LinkIcon"
                  tabler="IconLink"
                  hugeicons="LinkIcon"
                  phosphor="LinkIcon"
                  remixicon="RiLinksLine"
                />
                Link <MenubarShortcut>⌘K</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item41">
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
              <MenubarItem value="menu-item42">
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="SearchIcon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
                Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item43">
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
              <MenubarItem value="menu-item44">
                <IconPlaceholder
                  lucide="FileIcon"
                  tabler="IconFile"
                  hugeicons="FileIcon"
                  phosphor="FileIcon"
                  remixicon="RiFileLine"
                />
                New File <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem value="menu-item45">
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
              <MenubarItem value="delete-file" variant="destructive">
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
              <MenubarItem value="menu-item46">
                <IconPlaceholder
                  lucide="UserIcon"
                  tabler="IconUser"
                  hugeicons="UserIcon"
                  phosphor="UserIcon"
                  remixicon="RiUserLine"
                />
                Profile
              </MenubarItem>
              <MenubarItem value="menu-item47">
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
              <MenubarItem value="sign-out" variant="destructive">
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
              <MenubarItem value="delete-account" variant="destructive">
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
                  <MenubarItem value="menu-item48">
                    <IconPlaceholder
                      lucide="CopyIcon"
                      tabler="IconCopy"
                      hugeicons="CopyIcon"
                      phosphor="CopyIcon"
                      remixicon="RiFileCopyLine"
                    />
                    Copy
                  </MenubarItem>
                  <MenubarItem value="menu-item49">
                    <IconPlaceholder
                      lucide="ScissorsIcon"
                      tabler="IconCut"
                      hugeicons="ScissorIcon"
                      phosphor="ScissorsIcon"
                      remixicon="RiScissorsLine"
                    />
                    Cut
                  </MenubarItem>
                  <MenubarItem value="menu-item50">
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
                      <MenubarItem value="menu-item51">Save Page...</MenubarItem>
                      <MenubarItem value="menu-item52">Create Shortcut...</MenubarItem>
                      <MenubarItem value="menu-item53">Name Window...</MenubarItem>
                    </MenubarGroup>
                    <MenubarSeparator />
                    <MenubarGroup>
                      <MenubarItem value="menu-item54">Developer Tools</MenubarItem>
                    </MenubarGroup>
                  </MenubarSubContent>
                </MenubarSub>
                <MenubarSeparator />
                <MenubarGroup>
                  <MenubarItem value="delete-dialog" variant="destructive">
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
                  <MenubarItem value="menu-item55">
                    Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem value="menu-item56">
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

function MenubarWithInset() {
  const [showBookmarks, setShowBookmarks] = React.useState(true)
  const [showUrls, setShowUrls] = React.useState(false)
  const [theme, setTheme] = React.useState("system")

  return (
    <Example title="With Inset">
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent className="w-44">
            <MenubarGroup>
              <MenubarLabel>Actions</MenubarLabel>
              <MenubarItem value="menu-item57">
                <IconPlaceholder
                  lucide="CopyIcon"
                  tabler="IconCopy"
                  hugeicons="CopyIcon"
                  phosphor="CopyIcon"
                  remixicon="RiFileCopyLine"
                />
                Copy
              </MenubarItem>
              <MenubarItem value="menu-item58">
                <IconPlaceholder
                  lucide="ScissorsIcon"
                  tabler="IconCut"
                  hugeicons="ScissorIcon"
                  phosphor="ScissorsIcon"
                  remixicon="RiScissorsLine"
                />
                Cut
              </MenubarItem>
              <MenubarItem value="paste-inset" inset>Paste</MenubarItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel inset>Appearance</MenubarLabel>
              <MenubarCheckboxItem
                value="cb-bookmarks"
                inset
                checked={showBookmarks}
                onCheckedChange={setShowBookmarks}
              >
                Bookmarks
              </MenubarCheckboxItem>
              <MenubarCheckboxItem
                value="cb-full-urls"
                inset
                checked={showUrls}
                onCheckedChange={setShowUrls}
              >
                Full URLs
              </MenubarCheckboxItem>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarGroup>
              <MenubarLabel inset>Theme</MenubarLabel>
              <MenubarRadioGroup value={theme} onValueChange={(details) => setTheme(details.value)}>
                <MenubarRadioItem inset value="light">
                  Light
                </MenubarRadioItem>
                <MenubarRadioItem inset value="dark">
                  Dark
                </MenubarRadioItem>
                <MenubarRadioItem inset value="system">
                  System
                </MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarGroup>
            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger inset>More Options</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarGroup>
                  <MenubarItem value="menu-item59">Save Page...</MenubarItem>
                  <MenubarItem value="menu-item60">Create Shortcut...</MenubarItem>
                </MenubarGroup>
              </MenubarSubContent>
            </MenubarSub>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </Example>
  )
}