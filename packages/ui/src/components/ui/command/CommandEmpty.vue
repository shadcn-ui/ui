<script setup lang="ts">
import type { PrimitiveProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { Primitive } from 'radix-vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { useCommand } from '.'

const props = defineProps<PrimitiveProps & { class?: HTMLAttributes['class'] }>()

const delegatedProps = reactiveOmit(props, 'class')

const { filterState } = useCommand()
const isRender = computed(() => !!filterState.search && filterState.filtered.count === 0)
</script>

<template>
  <Primitive
    v-if="isRender"
    v-bind="delegatedProps"
    :class="cn('py-6 text-center text-sm', props.class)"
  >
    <slot>نتیجه‌ای یافت نشد.</slot>
  </Primitive>
</template>
