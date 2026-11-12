<script setup lang="ts">
import type { ComboboxEmptyProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { ComboboxEmpty } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps<ComboboxEmptyProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')
</script>

<template>
  <ComboboxEmpty v-bind="delegatedProps" :class="cn('py-6 text-center text-sm', props.class)">
    <slot />
  </ComboboxEmpty>
</template>
