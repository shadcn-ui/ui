<script setup lang="ts">
import type { TabsListProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { reactiveOmit } from "@vueuse/core"
import { TabsList } from "reka-ui"
import { cn } from "@/lib/utils"

const props = withDefaults(defineProps<TabsListProps & {
  class?: HTMLAttributes["class"]
  variant?: "default" | "line"
}>(), {
  variant: "default",
})

const delegatedProps = reactiveOmit(props, "class", "variant")
</script>

<template>
  <TabsList
    data-slot="tabs-list"
    :data-variant="variant"
    v-bind="delegatedProps"
    :class="cn(
      'cn-tabs-list group/tabs-list text-muted-foreground inline-flex w-fit items-center justify-center group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col',
      variant === 'default' && 'cn-tabs-list-variant-default bg-muted',
      variant === 'line' && 'cn-tabs-list-variant-line gap-1 bg-transparent',
      props.class,
    )"
  >
    <slot />
  </TabsList>
</template>
