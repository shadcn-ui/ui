<script setup lang="ts">
import type { ScrollAreaScrollbarProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import ScrollAreaScrollbar from './ScrollAreaScrollbar.vue'
import ScrollAreaThumb from './ScrollAreaThumb.vue'

/** میان‌بر هم‌نام با shadcn-vue: نوار پیمایش به‌همراه دستگیره. */
const props = withDefaults(
  defineProps<ScrollAreaScrollbarProps & { class?: HTMLAttributes['class'] }>(),
  { orientation: 'vertical' },
)
</script>

<template>
  <ScrollAreaScrollbar v-bind="props">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
</template>
