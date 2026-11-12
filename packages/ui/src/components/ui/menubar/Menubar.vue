<script setup lang="ts">
import type { MenubarRootEmits, MenubarRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { MenubarRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'

const props = defineProps<MenubarRootProps & { class?: HTMLAttributes['class'] }>()
const emits = defineEmits<MenubarRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')

const forwarded = useForwardPropsEmits(delegatedProps, emits)
const dir = useResolvedDirection(() => props.dir)
</script>

<template>
  <MenubarRoot
    v-bind="forwarded"
    :dir="dir"
    :class="
      cn('flex h-9 items-center gap-1 rounded-md border bg-background p-1 shadow-sm', props.class)
    "
  >
    <slot />
  </MenubarRoot>
</template>
