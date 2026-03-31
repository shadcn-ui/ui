<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import IconPlaceholder from "@/components/IconPlaceholder.vue"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <IconPlaceholder
    lucide="Loader2Icon"
    tabler="IconLoader2"
    hugeicons="Loading03Icon"
    phosphor="SpinnerGapIcon"
    remixicon="RiLoader4Line"
    role="status"
    aria-label="Loading"
    :class="cn('size-4 animate-spin', props.class)"
  />
</template>
