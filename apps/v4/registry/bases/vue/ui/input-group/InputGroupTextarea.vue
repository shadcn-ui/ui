<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { cn } from "@/lib/utils"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
</script>

<template>
  <Textarea
    data-slot="input-group-control"
    :class="cn(
      'flex-1 resize-none rounded-none border-0 bg-transparent py-3 shadow-none focus-visible:ring-0 dark:bg-transparent',
      props.class,
    )"
  />
</template>
