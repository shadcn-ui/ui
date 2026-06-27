<script setup lang="ts">
import { ref } from 'vue'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from '@/ui/menubar'

const user = ref('benoit')
const theme = ref('system')
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>Profiles</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup :model-value="user" @update:model-value="user = $event as string">
          <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
          <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
          <MenubarRadioItem value="luis">Luis</MenubarRadioItem>
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarItem inset>Edit...</MenubarItem>
        <MenubarItem inset>Add Profile...</MenubarItem>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Theme</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup :model-value="theme" @update:model-value="theme = $event as string">
          <MenubarRadioItem value="light">Light</MenubarRadioItem>
          <MenubarRadioItem value="dark">Dark</MenubarRadioItem>
          <MenubarRadioItem value="system">System</MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
