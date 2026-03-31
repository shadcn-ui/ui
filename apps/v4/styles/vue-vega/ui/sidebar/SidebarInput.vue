<script setup lang="ts">
import { Input } from "@/ui/input"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <Input
    data-slot="sidebar-input"
    data-sidebar="input"
    :class="cn('cn-sidebar-input', props.class)"
  >
    <slot />
  </Input>
</template>
