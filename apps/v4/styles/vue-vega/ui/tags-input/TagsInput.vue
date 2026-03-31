<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TagsInputRootEmits, TagsInputRootProps } from "reka-ui"
import { TagsInputRoot, useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  TagsInputRootProps & { class?: HTMLAttributes["class"] }
>()
const emits = defineEmits<TagsInputRootEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <TagsInputRoot
    v-slot="slotProps"
    v-bind="forwarded"
    :class="
      cn(
        'flex flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none',
        'focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        props.class
      )
    "
  >
    <slot v-bind="slotProps" />
  </TagsInputRoot>
</template>
