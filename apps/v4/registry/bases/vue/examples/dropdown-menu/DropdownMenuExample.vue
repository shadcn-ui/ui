<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import DropdownMenuBasic from "@/examples/dropdown-menu/DropdownMenuBasic.vue"
import DropdownMenuComplex from "@/examples/dropdown-menu/DropdownMenuComplex.vue"
import DropdownMenuInDialog from "@/examples/dropdown-menu/DropdownMenuInDialog.vue"
import DropdownMenuWithAvatar from "@/examples/dropdown-menu/DropdownMenuWithAvatar.vue"
import DropdownMenuWithCheckboxes from "@/examples/dropdown-menu/DropdownMenuWithCheckboxes.vue"
import DropdownMenuWithCheckboxesIcons from "@/examples/dropdown-menu/DropdownMenuWithCheckboxesIcons.vue"
import DropdownMenuWithDestructive from "@/examples/dropdown-menu/DropdownMenuWithDestructive.vue"
import DropdownMenuWithIcons from "@/examples/dropdown-menu/DropdownMenuWithIcons.vue"
import DropdownMenuWithRadio from "@/examples/dropdown-menu/DropdownMenuWithRadio.vue"
import DropdownMenuWithRadioIcons from "@/examples/dropdown-menu/DropdownMenuWithRadioIcons.vue"
import DropdownMenuWithShortcuts from "@/examples/dropdown-menu/DropdownMenuWithShortcuts.vue"
import DropdownMenuWithSubmenu from "@/examples/dropdown-menu/DropdownMenuWithSubmenu.vue"
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
