<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatJalali } from '@saaze/utils'
import { RangeCalendar, type DateRange } from '@saaze/ui'

const today = new Date()
const inAWeek = new Date(today)
inAWeek.setDate(today.getDate() + 6)

const range = ref<DateRange>({ start: today, end: inAWeek })

const summary = computed(() => {
  const { start, end } = range.value
  if (!start) return 'تاریخ شروع را انتخاب کنید.'
  if (!end) return `از ${formatJalali(start)} — تاریخ پایان را انتخاب کنید.`
  return `از ${formatJalali(start)} تا ${formatJalali(end)}`
})
</script>

<template>
  <div class="grid justify-items-center gap-3">
    <RangeCalendar v-model="range" :number-of-months="2" class="rounded-lg border" />
    <p class="text-sm text-muted-foreground" aria-live="polite">{{ summary }}</p>
  </div>
</template>
