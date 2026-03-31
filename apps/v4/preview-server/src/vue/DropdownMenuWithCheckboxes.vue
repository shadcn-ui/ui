<script setup lang="ts">
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components"
import { Button } from "@/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu"

const showStatusBar = ref(true)
const showActivityBar = ref(false)
const showPanel = ref(false)
</script>

<template>
  <Example title="With Checkboxes">
    <DropdownMenu>
      <DropdownMenuTrigger :as-child="true">
        <Button variant="outline" class="w-fit">
          Checkboxes
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent class="min-w-40">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            v-model:checked="showStatusBar"
          >
            <IconPlaceholder
              lucide="LayoutIcon"
              tabler="IconLayout"
              hugeicons="LayoutIcon"
              phosphor="LayoutIcon"
              remixicon="RiLayoutLine"
            />
            Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            v-model:checked="showActivityBar"
            :disabled="true"
          >
            <IconPlaceholder
              lucide="ActivityIcon"
              tabler="IconActivity"
              hugeicons="ActivityIcon"
              phosphor="ActivityIcon"
              remixicon="RiPulseLine"
            />
            Activity Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            v-model:checked="showPanel"
          >
            <IconPlaceholder
              lucide="PanelLeftIcon"
              tabler="IconLayoutSidebar"
              hugeicons="LayoutLeftIcon"
              phosphor="SidebarIcon"
              remixicon="RiSideBarLine"
            />
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </Example>
</template>
