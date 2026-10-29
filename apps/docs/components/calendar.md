# تقویم جلالی

<div class="saaze-badges">
  <span>Jalali</span>
  <span>Keyboard</span>
  <span>6×7 grid</span>
</div>

<p class="saaze-lead">
  تقویم جلالی کامل با گرید شش‌ردیفی، نام ماه‌ها و روزهای فارسی، پیمایش کلید و پشتیبانی از
  محدوده تاریخ و روزهای غیرفعال. این کامپوننت پایه <code>DatePicker</code> است.
</p>

<script setup>
import CalendarDemo from '../demos/CalendarDemo.vue'
import calendarDemoCode from '../demos/CalendarDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="تقویم با روزهای غیرفعال" description="روزهای جمعه غیرفعال شده‌اند. با کلیدهای جهت‌دار، Home/End و PageUp/PageDown جابه‌جا شوید." :code="calendarDemoCode">

  <CalendarDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Calendar } from '@saaze/ui'
import { ref } from 'vue'

const date = ref<Date | null>(new Date())
</script>

<template>
  <Calendar v-model="date" />
</template>
```

## محدوده تاریخ

```vue
<script setup lang="ts">
import { Calendar } from '@saaze/ui'
import { jalaliToGregorian } from '@saaze/utils'

const minDate = jalaliToGregorian({ year: 1405, month: 1, day: 1 })
const maxDate = jalaliToGregorian({ year: 1405, month: 12, day: 29 })
</script>

<template>
  <Calendar v-model="date" :min-date="minDate" :max-date="maxDate" />
</template>
```

## غیرفعال‌کردن روزهای خاص

```vue
<template>
  <Calendar v-model="date" :is-date-disabled="(value) => value.getDay() === 5" />
</template>
```

`is-date-disabled` یک `Date` میلادی می‌گیرد و باید `boolean` برگرداند. روزهای خارج از
`minDate`/`maxDate` نیز خودکار غیرفعال می‌شوند.

## API

| ویژگی             | نوع                       | پیش‌فرض | توضیح                                     |
| ----------------- | ------------------------- | ------- | ----------------------------------------- |
| `modelValue`      | `Date \| null`            | `null`  | تاریخ انتخاب‌شده؛ با `v-model`            |
| `defaultMonth`    | `Date \| null`            | `null`  | ماه نمایش اولیه                           |
| `minDate`         | `Date \| null`            | `null`  | کمترین تاریخ مجاز                         |
| `maxDate`         | `Date \| null`            | `null`  | بیشترین تاریخ مجاز                        |
| `disabled`        | `boolean`                 | `false` | غیرفعال‌کردن کل تقویم                     |
| `dir`             | `"rtl" \| "ltr"`          | `"rtl"` | جهت پیمایش و آیکن‌ها                      |
| `weekStartsOn`    | `number`                  | `6`     | شروع هفته بر اساس `Date.getDay`؛ ۶ = شنبه |
| `showOutsideDays` | `boolean`                 | `true`  | نمایش روزهای ماه قبل/بعد                  |
| `showToday`       | `boolean`                 | `true`  | نمایش دکمه «امروز»                        |
| `isDateDisabled`  | `(date: Date) => boolean` | —       | قاعده غیرفعال‌سازی                        |
| `class`           | `string`                  | —       | کلاس‌های اضافی                            |

### رویدادها

| رویداد              | نوع    | توضیح                            |
| ------------------- | ------ | -------------------------------- |
| `update:modelValue` | `Date` | تاریخ انتخاب‌شده                 |
| `select`            | `Date` | همان مقدار برای شنونده‌های اضافی |

### Expose

| نام           | نوع          | توضیح                          |
| ------------- | ------------ | ------------------------------ |
| `view`        | `JalaliDate` | سال و ماه در حال نمایش         |
| `selectToday` | `() => void` | انتخاب امروز در صورت مجاز بودن |

## پیمایش صفحه‌کلید

| کلید                    | رفتار                          |
| ----------------------- | ------------------------------ |
| `ArrowRight`            | روز قبل در RTL، روز بعد در LTR |
| `ArrowLeft`             | روز بعد در RTL، روز قبل در LTR |
| `ArrowUp` / `ArrowDown` | یک هفته قبل / بعد              |
| `Home` / `End`          | ابتدا / انتهای هفته            |
| `PageUp` / `PageDown`   | ماه قبل / بعد                  |

فقط یک روز در هر لحظه `tabindex="0"` دارد؛ بقیه `-1` هستند تا Tab از کل تقویم عبور کند.

## دسترس‌پذیری

- هر روز با `aria-label` کامل جلالی مانند «جمعه ۱۲ مرداد ۱۴۰۳» خوانده می‌شود.
- روز جاری با `aria-current="date"` و روز انتخاب‌شده با `aria-selected` مشخص می‌شود.
- عنوان ماه با `aria-live="polite"` اعلام می‌شود.
- دکمه‌های ماه قبل و بعد `aria-label` فارسی دارند.
- برای تقویم داخل فرم، یک `Label` یا `aria-label` برای گروه فراهم کنید.
