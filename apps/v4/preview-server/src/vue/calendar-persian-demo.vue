<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, PersianCalendar, toCalendar, today } from '@internationalized/date'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useDateFormatter } from 'reka-ui'
import { toDate } from 'reka-ui/date'
import { Calendar } from '@/ui/calendar'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
const placeholder = ref(toCalendar(today(getLocalTimeZone()), new PersianCalendar())) as Ref<DateValue>
// or
const defaultPlaceholder = toCalendar(today(getLocalTimeZone()), new PersianCalendar())

const formatter = useDateFormatter('fa')
</script>

<template>
  <div class="**:data-[slot=native-select-icon]:right-[unset] **:data-[slot=native-select-icon]:left-3.5">
    <Calendar
      v-model="date"
      v-model:placeholder="placeholder"
      locale="fa-IR"
      layout="month-and-year"
      class="rounded-md border shadow-sm"
      dir="rtl"
    >
      <template #calendar-next-icon>
        <ChevronLeft />
      </template>

      <template #calendar-prev-icon>
        <ChevronRight />
      </template>
    </Calendar>

    <div class="flex flex-col justify-center items-center gap-2">
      <div>
        {{
          formatter.custom(
            toDate(date, getLocalTimeZone()), {
              numberingSystem: 'latn',
            })
        }}
      </div>

      <div>
        {{ formatter.custom(date.toDate(getLocalTimeZone()), { month: 'short', year: 'numeric' }) }}
      </div>
    </div>
  </div>
</template>
