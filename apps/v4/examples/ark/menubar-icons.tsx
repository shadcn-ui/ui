import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/ark/ui/menubar"
import {
  FileIcon,
  FolderIcon,
  HelpCircleIcon,
  SaveIcon,
  SettingsIcon,
  TrashIcon,
} from "lucide-react"

export function MenubarIcons() {
  return (
    <Menubar className="w-72">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarItem value="1">
            <FileIcon />
            New File <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem value="2">
            <FolderIcon />
            Open Folder
          </MenubarItem>
          <MenubarSeparator />
          <MenubarItem value="3">
            <SaveIcon />
            Save <MenubarShortcut>⌘S</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>More</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem value="4">
              <SettingsIcon />
              Settings
            </MenubarItem>
            <MenubarItem value="5">
              <HelpCircleIcon />
              Help
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem variant="destructive">
              <TrashIcon />
              Delete
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
