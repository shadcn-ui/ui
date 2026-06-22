<script setup lang="ts">
import Underline from "@material-symbols/svg-400/rounded/format_underlined.svg?component"
import { Toggle } from '@/ui/toggle'
</script>

<template>
  <Toggle aria-label="Toggle underline" disabled>
    <Underline class="h-4 w-4" />
  </Toggle>
</template>
