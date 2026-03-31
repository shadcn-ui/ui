<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { Button } from "@/ui/button"
import { Calendar } from "@/ui/calendar"
import { Card, CardContent, CardFooter } from "@/ui/card"
import { Example } from "@/components"

const date = ref<CalendarDate>(
  new CalendarDate(
    new Date().getFullYear(),
    2,
    12,
  ),
)

const currentMonth = ref<CalendarDate>(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    1,
  ),
)

function addDays(dateValue: CalendarDate, days: number): CalendarDate {
  const jsDate = new Date(dateValue.year, dateValue.month - 1, dateValue.day)
  jsDate.setDate(jsDate.getDate() + days)
  return new CalendarDate(
    jsDate.getFullYear(),
    jsDate.getMonth() + 1,
    jsDate.getDate(),
  )
}

function handlePreset(daysToAdd: number) {
  const today = new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  )
  const newDate = addDays(today, daysToAdd)
  date.value = newDate
  currentMonth.value = new CalendarDate(
    newDate.year,
    newDate.month,
    1,
  )
}

const presets = [
  { label: "Today", value: 0 },
  { label: "Tomorrow", value: 1 },
  { label: "In 3 days", value: 3 },
  { label: "In a week", value: 7 },
  { label: "In 2 weeks", value: 14 },
]
</script>

<template>
  <Example title="With Presets">
    <Card class="mx-auto w-fit max-w-[300px]" size="sm">
      <CardContent class="px-4">
        <Calendar
          v-model="date"
          v-model:placeholder="currentMonth"
          fixed-weeks
          class="p-0 [--rdp-cell-size:theme(spacing.9.5)]"
        />
      </CardContent>
      <CardFooter class="flex flex-wrap gap-2 border-t">
        <Button
          v-for="preset in presets"
          :key="preset.value"
          variant="outline"
          size="sm"
          class="flex-1"
          @click="handlePreset(preset.value)"
        >
          {{ preset.label }}
        </Button>
      </CardFooter>
    </Card>
  </Example>
</template>
