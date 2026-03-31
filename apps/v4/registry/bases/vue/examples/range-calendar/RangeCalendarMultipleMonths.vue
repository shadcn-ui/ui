<script setup lang="ts">
import type { DateRange } from "reka-ui"
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { RangeCalendar } from "@/ui/range-calendar"
import { Example } from "@/components/example"

const range = ref<DateRange>({
  start: new CalendarDate(new Date().getFullYear(), 1, 10),
  end: new CalendarDate(new Date().getFullYear(), 2, 15),
})
</script>

<template>
  <Example title="Range Calendar with Multiple Months">
    <RangeCalendar v-model="range" :number-of-months="2" />
  </Example>
</template>
