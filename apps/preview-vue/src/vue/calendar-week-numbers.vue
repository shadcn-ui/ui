<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/ui/calendar'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
</script>

<template>
  <Calendar
    v-model="date"
    class="rounded-md border shadow-sm"
    :week-starts-on="0"
    show-week-numbers
  />
</template>
