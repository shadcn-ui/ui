# تقویم بازه‌ای

انتخاب بازه تاریخ روی تقویم جلالی. اولین کلیک تاریخ شروع و دومین کلیک تاریخ پایان را تعیین می‌کند؛ اگر تاریخ دوم قبل از اولی باشد، جای آن‌ها خودکار عوض می‌شود.

<script setup>
import RangeCalendarDemo from '../demos/RangeCalendarDemo.vue'
import demoCode from '../demos/RangeCalendarDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="بازه یک‌هفته‌ای" description="دو ماه کنار هم نمایش داده می‌شوند؛ با نشانگر روی روزها پیش‌نمایش بازه را ببینید." :code="demoCode">

  <RangeCalendarDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RangeCalendar, type DateRange } from '@saaze/ui'

const range = ref<DateRange>({ start: null, end: null })
</script>

<template>
  <RangeCalendar v-model="range" :number-of-months="2" />
</template>
```

## اجزا

مقدار مدل از نوع `DateRange` با فیلدهای `start` و `end` (شیء `Date` میلادی) است. ویژگی‌های `minDate`، `maxDate`، `isDateDisabled`، `weekStartsOn`، `showOutsideDays`، `numberOfMonths` و `dir` پشتیبانی می‌شوند. رویداد `select` وقتی هر دو سر بازه انتخاب شد اجرا می‌شود. ناوبری با صفحه‌کلید مانند [تقویم جلالی](/components/calendar) است.
