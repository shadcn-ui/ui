<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import LoaderIcon from "@material-symbols/svg-400/rounded/progress_activity.svg?component"
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <LoaderIcon
    role="status"
    aria-label="Loading"
    :class="cn('size-4 animate-spin', props.class)"
  />
</template>
