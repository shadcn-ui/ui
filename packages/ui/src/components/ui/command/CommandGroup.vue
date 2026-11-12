<script setup lang="ts">
import type { ListboxGroupProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ListboxGroup, ListboxGroupLabel, useId } from 'radix-vue'
import { computed, onMounted, onUnmounted } from 'vue'
import { cn } from '@/lib/utils'
import { provideCommandGroupContext, useCommand } from '.'

const props = defineProps<
  ListboxGroupProps & {
    class?: HTMLAttributes['class']
    heading?: string
  }
>()

const delegatedProps = reactiveOmit(props, 'class')

const { allGroups, filterState } = useCommand()
const id = useId()

const isRender = computed(() => (!filterState.search ? true : filterState.filtered.groups.has(id)))

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
    :class="
      cn(
        'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground',
        props.class,
      )
    "
    :hidden="isRender ? undefined : true"
  >
    <ListboxGroupLabel v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
      {{ heading }}
    </ListboxGroupLabel>
    <slot />
  </ListboxGroup>
</template>
