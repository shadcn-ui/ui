# تاریخ‌انتخاب‌کن

<div class="saaze-badges">
  <span>Jalali</span>
  <span>Radix Popover</span>
  <span>v-model</span>
</div>

<p class="saaze-lead">
  انتخاب تاریخ جلالی در یک پاپ‌اور، با نمایش کامل فارسی، پاک‌کردن سریع و محدوده تاریخ.
  تاریخ‌انتخاب‌کن روی تقویم جلالی سازه ساخته شده است.
</p>

<script setup>
import DatePickerDemo from '../demos/DatePickerDemo.vue'
import datePickerDemoCode from '../demos/DatePickerDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="انتخاب تاریخ تحویل" description="نمایش مقدار جلالی، پاک‌کردن با یک کلیک و محدودکردن انتخاب به یک بازه." :code="datePickerDemoCode">

  <DatePickerDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { DatePicker, Label } from '@saaze/ui'
import { ref } from 'vue'

const date = ref<Date | null>(null)
</script>

<template>
  <div class="grid gap-2">
    <Label for="delivery-date">تاریخ تحویل</Label>
    <DatePicker id="delivery-date" v-model="date" placeholder="انتخاب تاریخ" />
  </div>
</template>
```

## قالب نمایش

`displayFormat` از همان الگوهای `formatJalali` استفاده می‌کند:

```vue
<DatePicker v-model="date" display-format="dddd D MMMM YYYY" />
```

| الگو               | نمونه                |
| ------------------ | -------------------- |
| `YYYY/MM/DD`       | ۱۴۰۵/۰۸/۰۶           |
| `dddd D MMMM YYYY` | چهارشنبه ۶ آبان ۱۴۰۵ |
| `YY/M/D`           | ۰۵/۸/۶               |

## API

| ویژگی             | نوع                                      | پیش‌فرض          | توضیح                          |
| ----------------- | ---------------------------------------- | ---------------- | ------------------------------ |
| `modelValue`      | `Date \| null`                           | `null`           | تاریخ انتخاب‌شده؛ با `v-model` |
| `defaultMonth`    | `Date \| null`                           | `null`           | ماه اولیه تقویم                |
| `minDate`         | `Date \| null`                           | `null`           | کمترین تاریخ مجاز              |
| `maxDate`         | `Date \| null`                           | `null`           | بیشترین تاریخ مجاز             |
| `placeholder`     | `string`                                 | `"انتخاب تاریخ"` | متن جای خالی                   |
| `displayFormat`   | `string`                                 | `"YYYY/MM/DD"`   | الگوی نمایش                    |
| `disabled`        | `boolean`                                | `false`          | غیرفعال                        |
| `clearable`       | `boolean`                                | `true`           | دکمه پاک‌کردن                  |
| `id`              | `string`                                 | —                | شناسه دکمه برای اتصال Label    |
| `ariaLabel`       | `string`                                 | —                | برچسب دسترس‌پذیری              |
| `dir`             | `"rtl" \| "ltr"`                         | `"rtl"`          | جهت                            |
| `align`           | `"start" \| "center" \| "end"`           | `"start"`        | ترازبندی منطقی پاپ‌اور         |
| `side`            | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"`       | سمت باز شدن                    |
| `weekStartsOn`    | `number`                                 | `6`              | شروع هفته                      |
| `showOutsideDays` | `boolean`                                | `true`           | نمایش روزهای بیرون ماه         |
| `showToday`       | `boolean`                                | `true`           | دکمه امروز                     |
| `isDateDisabled`  | `(date: Date) => boolean`                | —                | قاعده غیرفعال‌سازی             |
| `class`           | `string`                                 | —                | کلاس ریشه                      |
| `popoverClass`    | `string`                                 | —                | کلاس پنل پاپ‌اور               |

### رویدادها

| رویداد              | نوع            | توضیح                            |
| ------------------- | -------------- | -------------------------------- |
| `update:modelValue` | `Date \| null` | تغییر مقدار؛ با `v-model`        |
| `change`            | `Date \| null` | همان مقدار برای شنونده‌های اضافی |

### Expose

| نام    | نوع       | توضیح                  |
| ------ | --------- | ---------------------- |
| `open` | `boolean` | وضعیت باز بودن پاپ‌اور |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { DatePicker } from '@saaze/ui'

const picker = ref<InstanceType<typeof DatePicker> | null>(null)
</script>

<template>
  <DatePicker ref="picker" v-model="date" />
  <Button @click="picker?.open = true">باز کردن تقویم</Button>
</template>
```

## محدودکردن تاریخ‌ها

```vue
<template>
  <DatePicker
    v-model="date"
    :min-date="minDate"
    :max-date="maxDate"
    :is-date-disabled="(value) => value.getDay() === 5"
  />
</template>
```

## پاک‌کردن مقدار

وقتی `clearable` فعال باشد و تاریخی انتخاب شده باشد، دکمه ضربدر در انتهای فیلد ظاهر می‌شود و
مقدار را `null` می‌کند:

```vue
<DatePicker v-model="date" :clearable="false" />
```

## دسترس‌پذیری

- دکمه بازکننده با `aria-label` یا `Label` نام‌گذاری می‌شود.
- پاپ‌اور با `Escape` بسته می‌شود و فوکوس به دکمه برمی‌گردد.
- تقویم داخلی همه رفتارهای صفحه‌کلید تقویم را دارد.
- دکمه پاک‌کردن `aria-label="پاک کردن تاریخ"` دارد.
