<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/ui/calendar'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
const defaultPlaceholder = today(getLocalTimeZone())
</script>

<template>
  <Calendar
    v-model="date"
    :default-placeholder="defaultPlaceholder"
    weekday-format="short"
    class="rounded-md border shadow-sm **:data-[slot=calendar-cell-trigger]:size-12!"
  >
    <template #calendar-heading="{ date, month }">
      <div class="flex gap-2 items-center">
        <div>
          Custom heading
        </div>
        <component :is="month" :date="date" />
      </div>
    </template>
  </Calendar>
</template>
