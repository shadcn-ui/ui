<script setup lang="ts">
import type { SelectGroupProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { SelectGroup } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<SelectGroupProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <SelectGroup :class="cn('p-1 w-full', props.class)" v-bind="delegatedProps">
    <slot />
  </SelectGroup>
</template>
