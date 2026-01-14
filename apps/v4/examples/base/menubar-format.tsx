import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/examples/base/ui/menubar"
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

export function MenubarFormat() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>Format</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <BoldIcon />
            Bold <MenubarShortcut>⌘B</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <ItalicIcon />
            Italic <MenubarShortcut>⌘I</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            <UnderlineIcon />
            Underline <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarCheckboxItem checked>Strikethrough</MenubarCheckboxItem>
          <MenubarCheckboxItem>Code</MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem>Show Ruler</MenubarCheckboxItem>
          <MenubarCheckboxItem checked>Show Grid</MenubarCheckboxItem>
          <MenubarSeparator />
          <MenubarItem inset>Zoom In</MenubarItem>
          <MenubarItem inset>Zoom Out</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
