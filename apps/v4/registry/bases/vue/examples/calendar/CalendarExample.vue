<script setup lang="ts">
import { ExampleWrapper } from "@/components/example"
import CalendarBookedDates from "@/examples/calendar/CalendarBookedDates.vue"
import CalendarCustomDays from "@/examples/calendar/CalendarCustomDays.vue"
import CalendarMultiple from "@/examples/calendar/CalendarMultiple.vue"
import CalendarRange from "@/examples/calendar/CalendarRange.vue"
import CalendarRangeMultipleMonths from "@/examples/calendar/CalendarRangeMultipleMonths.vue"
import CalendarSingle from "@/examples/calendar/CalendarSingle.vue"
import CalendarWeekNumbers from "@/examples/calendar/CalendarWeekNumbers.vue"
import CalendarWithPresets from "@/examples/calendar/CalendarWithPresets.vue"
import CalendarWithTime from "@/examples/calendar/CalendarWithTime.vue"
import DatePickerSimple from "@/examples/calendar/DatePickerSimple.vue"
import DatePickerWithDropdowns from "@/examples/calendar/DatePickerWithDropdowns.vue"
import DatePickerWithRange from "@/examples/calendar/DatePickerWithRange.vue"
</script>

<template>
  <ExampleWrapper>
    <CalendarSingle />
    <CalendarMultiple />
    <CalendarWeekNumbers />
    <CalendarBookedDates />
    <CalendarRange />
    <CalendarRangeMultipleMonths />
    <CalendarWithTime />
    <CalendarWithPresets />
    <CalendarCustomDays />
    <DatePickerSimple />
    <DatePickerWithDropdowns />
    <DatePickerWithRange />
  </ExampleWrapper>
</template>
