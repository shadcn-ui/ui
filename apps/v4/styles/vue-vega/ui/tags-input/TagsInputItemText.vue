<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { TagsInputItemTextProps } from "reka-ui"
import { TagsInputItemText, useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"

import { cn } from "@/lib/utils"

const props = defineProps<
  TagsInputItemTextProps & { class?: HTMLAttributes["class"] }
>()

const delegatedProps = reactiveOmit(props, "class")

const forwardedProps = useForwardProps(delegatedProps)
</script>

<template>
  <TagsInputItemText
    v-bind="forwardedProps"
    :class="cn('rounded bg-transparent px-2 py-0.5 text-sm', props.class)"
  />
</template>
