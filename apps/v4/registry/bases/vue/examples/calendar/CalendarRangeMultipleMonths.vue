<script setup lang="ts">
import type { DateRange } from "reka-ui"
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { Card, CardContent } from "@/ui/card"
import { RangeCalendar } from "@/ui/range-calendar"
import { Example } from "@/components/example"

const range = ref<DateRange>({
  start: new CalendarDate(new Date().getFullYear(), 4, 12),
  end: new CalendarDate(new Date().getFullYear(), 6, 11),
})
</script>

<template>
  <Example
    title="Range Multiple Months"
    container-class="lg:col-span-full 2xl:col-span-full"
    class="p-12"
  >
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <RangeCalendar
          v-model="range"
          :number-of-months="3"
          locale="es"
          fixed-weeks
        />
      </CardContent>
    </Card>
  </Example>
</template>
