# ورودی

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>v-model</span>
  <span>Persian digits</span>
</div>

<p class="saaze-lead">
  ورودی متنی با پشتیبانی از تبدیل خودکار رقم‌های فارسی. این کامپوننت ویژگی‌های بومی
  <code>input</code> را حفظ می‌کند و برای فرم‌های راست‌به‌چپ آماده است.
</p>

<script setup>
import InputDemo from '../demos/InputDemo.vue'
import inputDemoCode from '../demos/InputDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="ورودی‌های فارسی" description="ورودی شماره موبایل و مبلغ، رقم‌های لاتین و عربی را به فارسی تبدیل می‌کنند." :code="inputDemoCode">

  <InputDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Input, Label } from '@saaze/ui'
import { ref } from 'vue'

const phone = ref('')
</script>

<template>
  <div class="grid gap-2">
    <Label for="phone">شماره موبایل</Label>
    <Input
      id="phone"
      v-model="phone"
      persian-digits
      inputmode="numeric"
      placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
    />
  </div>
</template>
```

## رقم‌های فارسی

وقتی `persian-digits` فعال باشد:

- رقم‌های لاتین (`0-9`) و عربی-هندی (`٠-٩`) به رقم فارسی تبدیل می‌شوند.
- مقدار `v-model` همیشه رشته فارسی است؛ پیش از ارسال به API با `toLatinDigits` یا
  `parseNumber` آن را نرمال کنید.
- اگر `type="number"` بدهید، نوع مؤثر به `text` تغییر می‌کند تا رقم‌های فارسی در مرورگر
  پاک نشوند. برای صفحه‌کلید عددی از `inputmode="numeric"` استفاده کنید.

```vue
<Input v-model="amount" persian-digits inputmode="decimal" placeholder="۲٬۵۰۰٬۰۰۰" />
```

## API

| ویژگی           | نوع                | پیش‌فرض  | توضیح                                       |
| --------------- | ------------------ | -------- | ------------------------------------------- |
| `v-model`       | `string \| number` | —        | مقدار ورودی                                 |
| `type`          | `string`           | `"text"` | نوع HTML؛ با رقم فارسی به text تبدیل می‌شود |
| `persianDigits` | `boolean`          | `false`  | تبدیل خودکار رقم‌ها به فارسی                |
| `class`         | `string`           | —        | کلاس‌های اضافی                              |

ویژگی‌های دیگر مانند `placeholder`، `disabled`، `readonly`، `inputmode`، `autocomplete` و
`aria-*` به عنصر `input` منتقل می‌شوند.

### Expose

| نام     | نوع                        | توضیح                                        |
| ------- | -------------------------- | -------------------------------------------- |
| `input` | `HTMLInputElement \| null` | ارجاع به عنصر ورودی برای فوکوس یا انتخاب متن |

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Input } from '@saaze/ui'

const inputRef = ref<InstanceType<typeof Input> | null>(null)

function focusInput() {
  inputRef.value?.input?.focus()
}
</script>

<template>
  <Input ref="inputRef" />
</template>
```

## حالت خطا

با `aria-invalid="true"` حاشیه و حلقه فوکوس به رنگ خطا تغییر می‌کند:

```vue
<template>
  <Input v-model="email" type="email" aria-invalid="true" aria-describedby="email-error" />
  <p id="email-error" class="text-xs text-destructive">ایمیل معتبر نیست.</p>
</template>
```

## ورودی چپ‌به‌راست

برای ایمیل، آدرس یا کد رهگیری، جهت را روی خود ورودی تنظیم کنید:

```vue
<Input v-model="email" type="email" dir="ltr" class="text-left" />
```

## دسترس‌پذیری

- همیشه یک `Label` با `for` متناظر یا `aria-label` بدهید.
- پیام خطا را با `aria-describedby` به ورودی وصل کنید.
- برای ورودی‌های اجباری، `required` و در صورت نیاز `aria-required` را تنظیم کنید.
