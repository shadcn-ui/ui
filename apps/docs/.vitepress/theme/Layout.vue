<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { Toaster } from '@saaze/ui'
</script>

<template>
  <DefaultTheme.Layout>
    <template #layout-bottom>
      <Toaster />
    </template>
  </DefaultTheme.Layout>
</template>
