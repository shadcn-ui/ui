<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue"

const props = defineProps<{
  lucide?: string
  tabler?: string
  hugeicons?: string
  phosphor?: string
  remixicon?: string
}>()

// In the preview server, we always use Lucide icons
const iconName = computed(() => props.lucide)

const Icon = defineAsyncComponent(async () => {
  if (!iconName.value) {
    return { render: () => null }
  }
  const icons = await import("lucide-vue-next")
  const comp = (icons as Record<string, unknown>)[iconName.value]
  if (comp) {
    return comp as ReturnType<typeof defineAsyncComponent>
  }
  return { render: () => null }
})
</script>

<template>
  <Icon v-if="iconName" v-bind="$attrs" />
</template>
