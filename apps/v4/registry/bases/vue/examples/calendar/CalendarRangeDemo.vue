<script setup lang="ts">
import type { DateRange } from 'reka-ui'
import { getLocalTimeZone, today } from '@internationalized/date'
import { RangeCalendar } from '@/ui/range-calendar'

const start = today(getLocalTimeZone())
const end = start.add({ days: 7 })

const dateRange = ref({
  start,
  end,
}) as Ref<DateRange>
</script>

<template>
  <RangeCalendar
    v-model="dateRange"
    class="rounded-md border shadow-sm"
    :number-of-months="2"
    disable-days-outside-current-view
  />
</template>
