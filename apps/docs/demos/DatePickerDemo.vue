<script setup lang="ts">
import { computed, ref } from 'vue'
import { DatePicker, Label } from '@saaze/ui'
import { formatJalali, jalaliToGregorian } from '@saaze/utils'

const delivery = ref<Date | null>(jalaliToGregorian({ year: 1405, month: 8, day: 6 }))
const travel = ref<Date | null>(null)

const minDate = jalaliToGregorian({ year: 1405, month: 1, day: 1 })
const maxDate = jalaliToGregorian({ year: 1405, month: 12, day: 29 })

const deliveryLabel = computed(() =>
  delivery.value ? formatJalali(delivery.value, { pattern: 'dddd D MMMM YYYY' }) : 'انتخاب نشده',
)

const travelLabel = computed(() =>
  travel.value ? formatJalali(travel.value, { pattern: 'dddd D MMMM YYYY' }) : 'انتخاب نشده',
)
</script>

<template>
  <div class="grid w-full max-w-md gap-6">
    <div class="grid gap-2">
      <Label for="date-delivery">تاریخ تحویل</Label>
      <DatePicker id="date-delivery" v-model="delivery" />
      <p class="text-xs text-muted-foreground">
        مقدار انتخاب‌شده: <span class="font-medium text-foreground">{{ deliveryLabel }}</span>
      </p>
    </div>

    <div class="grid gap-2">
      <Label for="date-travel">تاریخ سفر (محدود به سال ۱۴۰۵)</Label>
      <DatePicker
        id="date-travel"
        v-model="travel"
        :min-date="minDate"
        :max-date="maxDate"
        placeholder="یک روز از سال ۱۴۰۵"
      />
      <p class="text-xs text-muted-foreground">
        مقدار انتخاب‌شده: <span class="font-medium text-foreground">{{ travelLabel }}</span>
      </p>
    </div>

    <div class="grid gap-2">
      <Label for="date-disabled">فیلد غیرفعال</Label>
      <DatePicker id="date-disabled" :model-value="delivery" disabled />
    </div>
  </div>
</template>
