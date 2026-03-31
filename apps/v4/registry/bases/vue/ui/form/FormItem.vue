<script lang="ts" setup>
import type { HTMLAttributes } from "vue"
import { useId } from "reka-ui"
import { provide } from "vue"
import { cn } from "@/lib/utils"
import { FORM_ITEM_INJECTION_KEY } from "./injectionKeys"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const id = useId()
provide(FORM_ITEM_INJECTION_KEY, id)
</script>

<template>
  <div
    data-slot="form-item"
    :class="cn('grid gap-2', props.class)"
  >
    <slot />
  </div>
</template>
