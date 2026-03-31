<script setup lang="ts">
import { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import { Calendar } from "@/ui/calendar"
import { Card, CardContent } from "@/ui/card"
import { Example } from "@/components/example"

const date = ref<CalendarDate>(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    3,
  ),
)
</script>

<template>
  <Example title="Week Numbers" class="justify-center">
    <Card class="mx-auto w-fit p-0">
      <CardContent class="p-0">
        <Calendar
          v-model="date"
          :week-starts-on="1"
          show-week-number
        />
      </CardContent>
    </Card>
  </Example>
</template>
