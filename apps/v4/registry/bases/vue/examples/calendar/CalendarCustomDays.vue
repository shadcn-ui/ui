<script setup lang="ts">
import type { DateRange } from "reka-ui"
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { Card, CardContent } from "@/ui/card"
import { RangeCalendar } from "@/ui/range-calendar"
import { Example } from "@/components/example"

const range = ref<DateRange>({
  start: new CalendarDate(new Date().getFullYear(), 12, 8),
  end: new CalendarDate(new Date().getFullYear(), 12, 18),
})

function isWeekend(date: CalendarDate) {
  const jsDate = new Date(date.year, date.month - 1, date.day)
  const dayOfWeek = jsDate.getDay()
  return dayOfWeek === 0 || dayOfWeek === 6
}

function getPrice(date: CalendarDate) {
  return isWeekend(date) ? "$120" : "$100"
}
</script>

<template>
  <Example title="Custom Days">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <RangeCalendar
          v-model="range"
          :number-of-months="1"
          layout="month-and-year"
          class="[--rdp-cell-size:theme(spacing.10)] md:[--rdp-cell-size:theme(spacing.12)]"
        >
          <template #calendar-cell="{ date }">
            <div class="flex flex-col items-center justify-center h-full">
              <span>{{ date.day }}</span>
              <span class="text-xs text-muted-foreground">{{ getPrice(date) }}</span>
            </div>
          </template>
        </RangeCalendar>
      </CardContent>
    </Card>
  </Example>
</template>
