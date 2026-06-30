<script setup lang="ts">
import { ref, type Ref } from 'vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { Calendar } from '@/ui/calendar'
import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter } from '@/ui/card'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>

const presets = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'In 3 days', days: 3 },
  { label: 'In a week', days: 7 },
  { label: 'In 2 weeks', days: 14 },
]

function applyPreset(days: number) {
  date.value = today(getLocalTimeZone()).add({ days })
}
</script>

<template>
  <Card class="mx-auto w-fit max-w-[300px]" size="sm">
    <CardContent>
      <Calendar
        v-model="date"
        class="p-0"
        fixed-weeks
      />
    </CardContent>
    <CardFooter class="flex flex-wrap gap-2 border-t">
      <Button
        v-for="preset in presets"
        :key="preset.days"
        variant="outline"
        size="sm"
        class="flex-1"
        @click="applyPreset(preset.days)"
      >
        {{ preset.label }}
      </Button>
    </CardFooter>
  </Card>
</template>
