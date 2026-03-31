<script lang="ts" setup>
import type { RangeCalendarGridHeadProps } from "reka-ui"
import { RangeCalendarGridHead } from "reka-ui"

const props = defineProps<RangeCalendarGridHeadProps>()
</script>

<template>
  <RangeCalendarGridHead
    data-slot="range-calendar-grid-head"
    v-bind="props"
  >
    <slot />
  </RangeCalendarGridHead>
</template>
