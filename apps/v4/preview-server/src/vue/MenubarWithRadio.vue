<script setup lang="ts">
import { ref } from "vue"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/ui/menubar"

const user = ref("benoit")
const theme = ref("system")
</script>

<template>
  <Menubar>
    <MenubarMenu>
      <MenubarTrigger>Profiles</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup v-model="user">
          <MenubarRadioItem value="andy">
            Andy
          </MenubarRadioItem>
          <MenubarRadioItem value="benoit">
            Benoit
          </MenubarRadioItem>
          <MenubarRadioItem value="luis">
            Luis
          </MenubarRadioItem>
        </MenubarRadioGroup>
        <MenubarSeparator />
        <MenubarGroup>
          <MenubarItem inset>
            Edit...
          </MenubarItem>
          <MenubarItem inset>
            Add Profile...
          </MenubarItem>
        </MenubarGroup>
      </MenubarContent>
    </MenubarMenu>
    <MenubarMenu>
      <MenubarTrigger>Theme</MenubarTrigger>
      <MenubarContent>
        <MenubarRadioGroup v-model="theme">
          <MenubarRadioItem value="light">
            Light
          </MenubarRadioItem>
          <MenubarRadioItem value="dark">
            Dark
          </MenubarRadioItem>
          <MenubarRadioItem value="system">
            System
          </MenubarRadioItem>
        </MenubarRadioGroup>
      </MenubarContent>
    </MenubarMenu>
  </Menubar>
</template>
