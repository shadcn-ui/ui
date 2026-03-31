<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import DropdownMenuBasic from "./DropdownMenuBasic.vue"
import DropdownMenuComplex from "./DropdownMenuComplex.vue"
import DropdownMenuInDialog from "./DropdownMenuInDialog.vue"
import DropdownMenuWithAvatar from "./DropdownMenuWithAvatar.vue"
import DropdownMenuWithCheckboxes from "./DropdownMenuWithCheckboxes.vue"
import DropdownMenuWithCheckboxesIcons from "./DropdownMenuWithCheckboxesIcons.vue"
import DropdownMenuWithDestructive from "./DropdownMenuWithDestructive.vue"
import DropdownMenuWithIcons from "./DropdownMenuWithIcons.vue"
import DropdownMenuWithRadio from "./DropdownMenuWithRadio.vue"
import DropdownMenuWithRadioIcons from "./DropdownMenuWithRadioIcons.vue"
import DropdownMenuWithShortcuts from "./DropdownMenuWithShortcuts.vue"
import DropdownMenuWithSubmenu from "./DropdownMenuWithSubmenu.vue"
</script>

<template>
  <ExampleWrapper>
    <DropdownMenuBasic />
    <DropdownMenuComplex />
    <DropdownMenuWithIcons />
    <DropdownMenuWithShortcuts />
    <DropdownMenuWithSubmenu />
    <DropdownMenuWithCheckboxes />
    <DropdownMenuWithCheckboxesIcons />
    <DropdownMenuWithRadio />
    <DropdownMenuWithRadioIcons />
    <DropdownMenuWithDestructive />
    <DropdownMenuWithAvatar />
    <DropdownMenuInDialog />
  </ExampleWrapper>
</template>
