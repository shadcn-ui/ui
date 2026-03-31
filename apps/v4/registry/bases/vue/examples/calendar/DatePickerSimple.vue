<script setup lang="ts">
import type { CalendarDate } from "@internationalized/date"
import { ref } from "vue"
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { Calendar } from "@/ui/calendar"
import { Field, FieldLabel } from "@/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"
import { Example } from "@/components/example"

const date = ref<CalendarDate>()

function formatDate(date?: CalendarDate): string {
  if (!date)
    return ""
  const jsDate = new Date(date.year, date.month - 1, date.day)
  return jsDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}
</script>

<template>
  <Example title="Date Picker Simple">
    <Field class="mx-auto w-72">
      <FieldLabel html-for="date-picker-simple">
        Date
      </FieldLabel>
      <Popover>
        <PopoverTrigger :as-child="true">
          <Button
            id="date-picker-simple"
            variant="outline"
            class="justify-start px-2.5 font-normal"
          >
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="CalendarIcon"
              phosphor="CalendarIcon"
              remixicon="RiCalendarLine"
              data-icon="inline-start"
            />
            <span v-if="date">{{ formatDate(date) }}</span>
            <span v-else>Pick a date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto p-0" align="start">
          <Calendar v-model="date" />
        </PopoverContent>
      </Popover>
    </Field>
  </Example>
</template>
