<script setup lang="ts">
import { ExampleWrapper } from "@/components"
import CalendarBookedDates from "./CalendarBookedDates.vue"
import CalendarCustomDays from "./CalendarCustomDays.vue"
import CalendarMultiple from "./CalendarMultiple.vue"
import CalendarRange from "./CalendarRange.vue"
import CalendarRangeMultipleMonths from "./CalendarRangeMultipleMonths.vue"
import CalendarSingle from "./CalendarSingle.vue"
import CalendarWeekNumbers from "./CalendarWeekNumbers.vue"
import CalendarWithPresets from "./CalendarWithPresets.vue"
import CalendarWithTime from "./CalendarWithTime.vue"
import DatePickerSimple from "./DatePickerSimple.vue"
import DatePickerWithDropdowns from "./DatePickerWithDropdowns.vue"
import DatePickerWithRange from "./DatePickerWithRange.vue"
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
