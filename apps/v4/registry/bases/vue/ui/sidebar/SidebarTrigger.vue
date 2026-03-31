<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { IconPlaceholder } from "@/components/icon-placeholder"
import { Button } from "@/ui/button"
import { useSidebar } from "./utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const { toggleSidebar } = useSidebar()
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon-sm"
    :class="cn('cn-sidebar-trigger', props.class)"
    @click="toggleSidebar"
  >
    <IconPlaceholder
      lucide="PanelLeftIcon"
      tabler="IconLayoutSidebar"
      hugeicons="SidebarLeftIcon"
      phosphor="SidebarIcon"
      remixicon="RiSideBarLine"
    />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>
