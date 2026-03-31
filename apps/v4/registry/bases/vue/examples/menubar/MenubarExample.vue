<script setup lang="ts">
import { Example, ExampleWrapper } from "@/components/example"
import MenubarBasic from "@/examples/menubar/MenubarBasic.vue"
import MenubarWithCheckboxes from "@/examples/menubar/MenubarWithCheckboxes.vue"
import MenubarWithRadio from "@/examples/menubar/MenubarWithRadio.vue"
import MenubarWithSubmenu from "@/examples/menubar/MenubarWithSubmenu.vue"
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
