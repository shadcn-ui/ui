<script setup lang="ts">
import type { DateRange } from "reka-ui"
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { RangeCalendar } from "@/ui/range-calendar"
import { Example } from "@/components"

const range = ref<DateRange>({
  start: new CalendarDate(new Date().getFullYear(), 1, 1),
  end: new CalendarDate(new Date().getFullYear(), 1, 7),
})
</script>

<template>
  <Example title="Basic Range Calendar">
    <RangeCalendar v-model="range" />
  </Example>
</template>
