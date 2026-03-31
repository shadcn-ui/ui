<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { LayoutTypes } from '@/ui/calendar'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ref } from 'vue'
import { Calendar } from '@/ui/calendar'
import { Label } from '@/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'

const defaultPlaceholder = today(getLocalTimeZone())
const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
const layout = ref<LayoutTypes>('month-and-year')
</script>

<template>
  <div class="flex flex-col gap-4">
    <Calendar
      v-model="date"
      :default-placeholder="defaultPlaceholder"
      class="rounded-md border shadow-sm"
      :layout
      disable-days-outside-current-view
    />
    <div class="flex flex-col gap-3">
      <Label for="dropdown" class="px-1">
        Dropdown
      </Label>
      <Select
        v-model="layout"
      >
        <SelectTrigger
          id="dropdown"
          size="sm"
          class="bg-background w-full"
        >
          <SelectValue placeholder="Dropdown" />
        </SelectTrigger>
        <SelectContent align="center">
          <SelectItem value="month-and-year">
            Month and Year
          </SelectItem>
          <SelectItem value="month-only">
            Month Only
          </SelectItem>
          <SelectItem value="year-only">
            Year Only
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</template>
