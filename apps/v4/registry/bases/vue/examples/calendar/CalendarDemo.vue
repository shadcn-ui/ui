<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, fromDate, getLocalTimeZone } from '@internationalized/date'
import { Calendar } from '@/ui/calendar'

const date = ref(fromDate(new Date(), getLocalTimeZone())) as Ref<DateValue>
</script>

<template>
  <Calendar
    v-model="date"
    class="rounded-md border shadow-sm"
    layout="month-and-year"
    :min-value="new CalendarDate(1925, 1, 1)"
    :max-value="new CalendarDate(2035, 1, 1)"
  />
</template>
