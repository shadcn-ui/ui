<script setup lang="ts">
import type { SelectGroupProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { SelectGroup } from "reka-ui"
import { cn } from "@/lib/utils"

const props = defineProps<SelectGroupProps & { class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")
</script>

<template>
  <SelectGroup
    data-slot="select-group"
    v-bind="delegatedProps"
    :class="cn('cn-select-group', props.class)"
  >
    <slot />
  </SelectGroup>
</template>
