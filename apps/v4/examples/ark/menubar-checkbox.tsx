import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/ark/ui/menubar"

export function MenubarCheckbox() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent className="w-64">
          <MenubarCheckboxItem
            value="always-show-bookmarks-bar"
            checked={false}
          >
            Always Show Bookmarks Bar
          </MenubarCheckboxItem>
          <MenubarCheckboxItem value="always-show-full-urls" checked>
            Always Show Full URLs
          </MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem value="reload" inset>
            Reload <MenubarShortcut>⌘R</MenubarShortcut>
          </MenubarItem>
          <MenubarItem value="force-reload" disabled inset>
            Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem value="strikethrough" checked>
            Strikethrough
          </MenubarCheckboxItem>
          <MenubarCheckboxItem value="code" checked={false}>
            Code
          </MenubarCheckboxItem>
          <MenubarCheckboxItem value="superscript" checked={false}>
            Superscript
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
