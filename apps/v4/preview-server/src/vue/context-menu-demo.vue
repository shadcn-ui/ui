<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import ContextMenuBasic from "./ContextMenuBasic.vue"
import ContextMenuInDialog from "./ContextMenuInDialog.vue"
import ContextMenuWithCheckboxes from "./ContextMenuWithCheckboxes.vue"
import ContextMenuWithDestructive from "./ContextMenuWithDestructive.vue"
import ContextMenuWithGroups from "./ContextMenuWithGroups.vue"
import ContextMenuWithIcons from "./ContextMenuWithIcons.vue"
import ContextMenuWithRadio from "./ContextMenuWithRadio.vue"
import ContextMenuWithShortcuts from "./ContextMenuWithShortcuts.vue"
import ContextMenuWithSides from "./ContextMenuWithSides.vue"
import ContextMenuWithSubmenu from "./ContextMenuWithSubmenu.vue"
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
