<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'
import { ChevronDownIcon } from 'lucide-vue-next'
import { Button } from '@/ui/button'
import { Calendar } from '@/ui/calendar'
import { Label } from '@/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/ui/popover'

const date = ref(today(getLocalTimeZone())) as Ref<DateValue>
</script>

<template>
  <div class="flex flex-col gap-3">
    <Label for="date" class="px-1">
      Date of birth
    </Label>
    <Popover v-slot="{ close }">
      <PopoverTrigger as-child>
        <Button
          id="date"
          variant="outline"
          class="w-48 justify-between font-normal"
        >
          {{ date ? date.toDate(getLocalTimeZone()).toLocaleDateString() : "Select date" }}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent class="w-auto overflow-hidden p-0" align="start">
        <Calendar
          :model-value="date"
          layout="month-and-year"
          @update:model-value="(value) => {
            if (value) {
              date = value
              close()
            }
          }"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
