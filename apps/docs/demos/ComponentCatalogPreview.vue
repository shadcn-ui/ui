<script setup lang="ts">
import DemoBlock from '../.vitepress/theme/DemoBlock.vue'
import NewComponentsDemo from './NewComponentsDemo.vue'

type DemoCategory = 'display' | 'layout' | 'forms' | 'overlays' | 'status'

defineProps<{
  category: DemoCategory
  title: string
  description: string
}>()
</script>

<template>
  <DemoBlock :title="title" :description="description">
    <NewComponentsDemo :category="category" />
  </DemoBlock>
</template>
