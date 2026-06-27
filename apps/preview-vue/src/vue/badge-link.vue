<script setup lang="ts">
import ArrowUpRightIcon from "@material-symbols/svg-400/rounded/north_east.svg?component"
import { Badge } from '@/ui/badge'
</script>

<template>
  <Badge as-child>
    <a href="#link">
      Open Link <ArrowUpRightIcon data-icon="inline-end" />
    </a>
  </Badge>
</template>
