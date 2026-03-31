<script setup lang="ts">
import type { HTMLAttributes } from "vue"
import { computed } from "vue"
import { cn } from "@/lib/utils"

const props = defineProps<{
  class?: HTMLAttributes["class"]
  errors?: Array<string | { message: string | undefined } | undefined>
}>()

const content = computed(() => {
  if (!props.errors || props.errors.length === 0)
    return null

  const uniqueErrors = [
    ...new Map(
      props.errors
        .filter(Boolean)
        .map((error) => {
          const message = typeof error === "string" ? error : error?.message
          return [message, error]
        }),
    ).values(),
  ]

  if (uniqueErrors.length === 1 && uniqueErrors[0]) {
    return typeof uniqueErrors[0] === "string" ? uniqueErrors[0] : uniqueErrors[0].message
  }

  return uniqueErrors.map(error => typeof error === "string" ? error : error?.message)
})
</script>

<template>
  <div
    v-if="$slots.default || content"
    role="alert"
    data-slot="field-error"
    :class="cn('text-destructive text-sm font-normal', props.class)"
  >
    <slot v-if="$slots.default" />

    <template v-else-if="typeof content === 'string'">
      {{ content }}
    </template>

    <ul v-else-if="Array.isArray(content)" class="ml-4 flex list-disc flex-col gap-1">
      <li v-for="(error, index) in content" :key="index">
        {{ error }}
      </li>
    </ul>
  </div>
</template>
