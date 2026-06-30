<script setup lang="ts">
import FileIcon from "@material-symbols/svg-400/rounded/description.svg?component"
import FolderIcon from "@material-symbols/svg-400/rounded/folder.svg?component"
import SaveIcon from "@material-symbols/svg-400/rounded/save.svg?component"
import SettingsIcon from "@material-symbols/svg-400/rounded/settings.svg?component"
import HelpCircleIcon from "@material-symbols/svg-400/rounded/help.svg?component"
import TrashIcon from "@material-symbols/svg-400/rounded/delete.svg?component"

import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/ui/menubar'
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>File</MenubarTrigger>
      <MenubarContent>
        <MenubarItem>
          <FileIcon />
          New File <MenubarShortcut>⌘N</MenubarShortcut>
        </MenubarItem>
        <MenubarItem>
          <FolderIcon />
          Open Folder
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <SaveIcon />
          Save <MenubarShortcut>⌘S</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>More</MenubarTrigger>
      <MenubarContent>
        <MenubarGroup>
          <MenubarItem>
            <SettingsIcon />
            Settings
          </MenubarItem>
          <MenubarItem>
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
</template>
