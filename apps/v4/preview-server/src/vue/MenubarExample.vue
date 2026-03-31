<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components"
import MenubarBasic from "./MenubarBasic.vue"
import MenubarWithCheckboxes from "./MenubarWithCheckboxes.vue"
import MenubarWithRadio from "./MenubarWithRadio.vue"
import MenubarWithSubmenu from "./MenubarWithSubmenu.vue"
</script>

<template>
  <ExampleWrapper>
    <Example title="Basic">
      <MenubarBasic />
    </Example>
    <Example title="With Submenu">
      <MenubarWithSubmenu />
    </Example>
    <Example title="With Checkboxes">
      <MenubarWithCheckboxes />
    </Example>
    <Example title="With Radio">
      <MenubarWithRadio />
    </Example>
  </ExampleWrapper>
</template>
