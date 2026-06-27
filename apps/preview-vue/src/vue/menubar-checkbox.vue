<script setup lang="ts">
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
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
      <MenubarTrigger>View</MenubarTrigger>
      <MenubarContent class="w-64">
        <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
        <MenubarCheckboxItem :model-value="true">
          Always Show Full URLs
        </MenubarCheckboxItem>
        <MenubarSeparator />
        <MenubarItem inset>
          Reload <MenubarShortcut>⌘R</MenubarShortcut>
        </MenubarItem>
        <MenubarItem disabled inset>
          Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Format</MenubarTrigger>
      <MenubarContent>
        <MenubarCheckboxItem :model-value="true">Strikethrough</MenubarCheckboxItem>
        <MenubarCheckboxItem>Code</MenubarCheckboxItem>
        <MenubarCheckboxItem>Superscript</MenubarCheckboxItem>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
