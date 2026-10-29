<script setup lang="ts">
import { computed, ref } from 'vue'
import { Calendar } from '@saaze/ui'
import {
  formatJalali,
  getJalaliMonthName,
  gregorianToJalali,
  jalaliToGregorian,
  toPersianDigits,
} from '@saaze/utils'
import { CalendarDays } from 'lucide-vue-next'

const selected = ref<Date>(jalaliToGregorian({ year: 1404, month: 2, day: 25 }))

const selectedLabel = computed(() => formatJalali(selected.value, { pattern: 'dddd D MMMM YYYY' }))
const jalali = computed(() => gregorianToJalali(selected.value))

const isFriday = (date: Date) => date.getDay() === 5
</script>

<template>
  <div class="flex w-full flex-wrap items-start justify-center gap-6">
    <Calendar
      v-model="selected"
      :default-month="selected"
      :is-date-disabled="isFriday"
      class="border shadow-sm"
    />

    <div class="grid w-full max-w-xs gap-4 rounded-xl border bg-card p-5">
      <div class="flex items-center gap-2 text-sm font-semibold">
        <CalendarDays class="size-4 text-primary" aria-hidden="true" />
        تاریخ انتخاب‌شده
      </div>

      <p class="text-lg font-bold text-foreground">{{ selectedLabel }}</p>

      <dl class="grid gap-2 text-xs text-muted-foreground">
        <div class="flex items-center justify-between gap-3">
          <dt>سال جلالی</dt>
          <dd class="font-medium text-foreground">{{ toPersianDigits(jalali.year) }}</dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt>ماه</dt>
          <dd class="font-medium text-foreground">{{ getJalaliMonthName(jalali.month) }}</dd>
        </div>
        <div class="flex items-center justify-between gap-3">
          <dt>روز</dt>
          <dd class="font-medium text-foreground">{{ toPersianDigits(jalali.day) }}</dd>
        </div>
      </dl>

      <p class="rounded-lg bg-muted px-3 py-2 text-xs leading-6 text-muted-foreground">
        روزهای جمعه در این نمونه غیرفعال شده‌اند. با کلیدهای جهت‌دار می‌توانید در تقویم جابه‌جا
        شوید.
      </p>
    </div>
  </div>
</template>
