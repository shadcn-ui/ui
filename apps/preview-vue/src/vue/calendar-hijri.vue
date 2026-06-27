<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, PersianCalendar, toCalendar, today } from '@internationalized/date'
import ChevronLeft from "@material-symbols/svg-400/rounded/chevron_left.svg?component"
import ChevronRight from "@material-symbols/svg-400/rounded/chevron_right.svg?component"
import { Calendar } from '@/ui/calendar'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
const placeholder = ref(toCalendar(today(getLocalTimeZone()), new PersianCalendar())) as Ref<DateValue>
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
  </div>
</template>
