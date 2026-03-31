<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
const open = ref(false)
</script>

<template>
  <div class="flex gap-4">
    <div class="flex flex-col gap-3">
      <Label for="date-picker" class="px-1">
        Date
      </Label>
      <Popover v-model:open="open">
        <PopoverTrigger as-child>
          <Button
            id="date-picker"
            variant="outline"
            class="w-32 justify-between font-normal"
          >
            {{ date ? date.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date" }}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-auto overflow-hidden p-0" align="start">
          <Calendar
            :model-value="date"
            @update:model-value="(value) => {
              if (value) {
                date = value
                open = false
              }
            }"
          />
        </PopoverContent>
      </Popover>
    </div>
    <div class="flex flex-col gap-3">
      <Label for="time-picker" class="px-1">
        Time
      </Label>
      <Input
        id="time-picker"
        type="time"
        step="1"
        default-value="10:30:00"
        class="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
      />
    </div>
  </div>
</template>
