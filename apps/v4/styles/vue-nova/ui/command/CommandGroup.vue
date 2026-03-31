<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import type { ListboxGroupProps } from "reka-ui"
import { ListboxGroup, ListboxGroupLabel, useId } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, onMounted, onUnmounted } from "vue"

import { cn } from "@/lib/utils"

import { provideCommandGroupContext, useCommand } from "."

const props = defineProps<
  ListboxGroupProps & {
    class?: HTMLAttributes["class"]
    heading?: string
  }
>()

const delegatedProps = reactiveOmit(props, "class")

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() =>
  !filterState.search ? true : filterState.filtered.groups.has(id)
)

provideCommandGroupContext({ id })
onMounted(() => {
  if (!allGroups.value.has(id)) allGroups.value.set(id, new Set())
})
onUnmounted(() => {
  allGroups.value.delete(id)
})
</script>

<template>
  <ListboxGroup
    v-bind="delegatedProps"
    :id="id"
    data-slot="command-group"
    :class="cn('cn-command-group', props.class)"
    :hidden="isRender ? undefined : true"
  >
    <ListboxGroupLabel
      v-if="heading"
      data-slot="command-group-heading"
      class="cn-command-group-heading"
    >
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
