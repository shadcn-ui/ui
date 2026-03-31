<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import ContextMenuBasic from "@/examples/context-menu/ContextMenuBasic.vue"
import ContextMenuInDialog from "@/examples/context-menu/ContextMenuInDialog.vue"
import ContextMenuWithCheckboxes from "@/examples/context-menu/ContextMenuWithCheckboxes.vue"
import ContextMenuWithDestructive from "@/examples/context-menu/ContextMenuWithDestructive.vue"
import ContextMenuWithGroups from "@/examples/context-menu/ContextMenuWithGroups.vue"
import ContextMenuWithIcons from "@/examples/context-menu/ContextMenuWithIcons.vue"
import ContextMenuWithRadio from "@/examples/context-menu/ContextMenuWithRadio.vue"
import ContextMenuWithShortcuts from "@/examples/context-menu/ContextMenuWithShortcuts.vue"
import ContextMenuWithSides from "@/examples/context-menu/ContextMenuWithSides.vue"
import ContextMenuWithSubmenu from "@/examples/context-menu/ContextMenuWithSubmenu.vue"
</script>

<template>
  <ExampleWrapper>
    <ContextMenuBasic />
    <ContextMenuWithSides />
    <ContextMenuWithIcons />
    <ContextMenuWithShortcuts />
    <ContextMenuWithSubmenu />
    <ContextMenuWithGroups />
    <ContextMenuWithCheckboxes />
    <ContextMenuWithRadio />
    <ContextMenuWithDestructive />
    <ContextMenuInDialog />
  </ExampleWrapper>
</template>
