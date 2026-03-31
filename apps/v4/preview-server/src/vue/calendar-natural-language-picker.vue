<script lang="ts">
export function formatDate(date: Date | undefined) {
  if (!date) {
    return ''
  }
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<script setup lang="ts">
import { fromDate, getLocalTimeZone } from '@internationalized/date'
import { parseDate } from 'chrono-node'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover'

const inputValue = ref('In 2 days')
const nativeDate = computed(() => {
  return parseDate(inputValue.value)
})
const open = ref(false)
</script>

<template>
  <div class="flex flex-col gap-3">
    <Label for="date" class="px-1">
      Schedule Date
    </Label>
    <div class="relative flex gap-2">
      <Input
        id="date"
        :model-value="inputValue"
        placeholder="Tomorrow or next week"
        class="bg-background pr-10"
        @update:model-value="(value) => {
          if (value) {
            inputValue = value.toString()
            nativeDate = parseDate(value.toString())
          }
        }"
      />
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button
            id="date-picker"
            variant="ghost"
            class="absolute top-1/2 right-2 size-6 -translate-y-1/2"
          >
            <CalendarIcon class="size-3.5" />
            <span class="sr-only">Select date</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="end">
          <Calendar
            :model-value="fromDate(nativeDate!, getLocalTimeZone())"
            @update:model-value="(value) => {
              if (value) {
                nativeDate = value.toDate(getLocalTimeZone())
                inputValue = formatDate(value.toDate(getLocalTimeZone()))
                open = false
              }
            }"
          />
        </PopoverContent>
      </Popover>
    </div>
    <div class="text-muted-foreground px-1 text-sm">
      Your post will be published on
      <span class="font-medium">{{ formatDate(nativeDate!) }}</span>.
    </div>
  </div>
</template>
