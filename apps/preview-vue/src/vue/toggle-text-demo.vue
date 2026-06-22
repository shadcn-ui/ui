<script setup lang="ts">
import Italic from "@material-symbols/svg-400/rounded/format_italic.svg?component"

import { Toggle } from '@/ui/toggle'
</script>

<template>
  <Toggle aria-label="Toggle italic">
    <Italic />
    Italic
  </Toggle>
</template>
