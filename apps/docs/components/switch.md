# سوییچ

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Switch</span>
  <span>v-model:checked</span>
</div>

<p class="saaze-lead">
  سوییچ برای روشن/خاموش کردن یک تنظیم فوری. دسته آن با ویژگی‌های منطقی حرکت می‌کند و در
  راست‌به‌چپ از سمت درست شروع می‌شود.
</p>

<script setup>
import SwitchDemo from '../demos/SwitchDemo.vue'
import switchDemoCode from '../demos/SwitchDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="تنظیمات روشن/خاموش" description="ترکیب سوییچ با برچسب و متن توضیحی؛ حرکت دسته در RTL برعکس می‌شود." :code="switchDemoCode">

  <SwitchDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Label, Switch } from '@saaze/ui'
import { ref } from 'vue'

const notifications = ref(true)
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Label for="notifications">اعلان‌های ایمیلی</Label>
    <Switch id="notifications" v-model:checked="notifications" />
  </div>
</template>
```

## API

| ویژگی            | نوع                   | پیش‌فرض  | توضیح                                 |
| ---------------- | --------------------- | -------- | ------------------------------------- |
| `checked`        | `boolean`             | —        | مقدار کنترل‌شده؛ با `v-model:checked` |
| `defaultChecked` | `boolean`             | —        | مقدار اولیه در حالت کنترل‌نشده        |
| `disabled`       | `boolean`             | `false`  | غیرفعال‌کردن                          |
| `required`       | `boolean`             | `false`  | الزامی در فرم                         |
| `name`           | `string`              | —        | نام فیلد فرم                          |
| `value`          | `string`              | `"on"`   | مقدار ارسالی در فرم                   |
| `id`             | `string`              | —        | شناسه برای اتصال به Label             |
| `as`             | `string \| Component` | `button` | عنصر ریشه                             |
| `asChild`        | `boolean`             | `false`  | انتقال ویژگی‌ها به فرزند              |
| `class`          | `string`              | —        | کلاس‌های اضافی                        |

### رویدادها

| رویداد           | نوع       | توضیح                  |
| ---------------- | --------- | ---------------------- |
| `update:checked` | `boolean` | تغییر وضعیت روشن/خاموش |

## فرم‌ها

```vue
<form>
  <Switch name="two-factor" value="enabled" v-model:checked="twoFactor" />
</form>
```

## دسترس‌پذیری

- سوییچ نقش `switch` و وضعیت `aria-checked` را خودکار مدیریت می‌کند.
- برای هر سوییچ یک نام قابل خواندن با `Label` یا `aria-label` فراهم کنید.
- اگر تغییر بلافاصله ذخیره می‌شود، نتیجه را با پیام کوتاه یا `aria-live` اعلام کنید.
- برای انتخاب بین چند گزینه از `RadioGroup` استفاده کنید، نه چند سوییچ.
