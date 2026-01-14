import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/radix/ui/menubar"
import {
  FileIcon,
  FolderIcon,
  LogOutIcon,
  SettingsIcon,
  TrashIcon,
  UserIcon,
} from "lucide-react"

export function MenubarDestructive() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent className="w-40">
          <MenubarGroup>
            <MenubarItem>
              <FileIcon />
              New File <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <FolderIcon />
              Open Folder
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem variant="destructive">
              <TrashIcon />
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
              <UserIcon />
              Profile
            </MenubarItem>
            <MenubarItem>
              <SettingsIcon />
              Settings
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
            <MenubarItem variant="destructive">
              <LogOutIcon />
              Sign out
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarGroup>
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
