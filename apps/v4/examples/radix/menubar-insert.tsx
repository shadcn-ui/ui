import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/examples/radix/ui/menubar"
import {
  CheckIcon,
  ImageIcon,
  LinkIcon,
  SearchIcon,
  TableIcon,
} from "lucide-react"

export function MenubarInsert() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Insert</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>
              <ImageIcon />
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
              <LinkIcon />
              Link <MenubarShortcut>⌘K</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <TableIcon />
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
              <SearchIcon />
              Find & Replace <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <CheckIcon />
              Spell Check
            </MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
