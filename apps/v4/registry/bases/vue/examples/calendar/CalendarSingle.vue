<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { Calendar } from "@/ui/calendar"
import { Card, CardContent } from "@/ui/card"
import { Example } from "@/components/example"

const date = ref(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    12,
  ),
)
</script>

<template>
  <Example title="Single">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          :model-value="date"
          layout="month-and-year"
          @update:model-value="(value) => date = value"
        />
      </CardContent>
    </Card>
  </Example>
</template>
