# برچسب

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Label</span>
  <span>a11y</span>
</div>

<p class="saaze-lead">
  برچسب، متن توضیحی یک کنترل فرم را به آن متصل می‌کند. کلیک روی برچسب، کنترل مرتبط را فوکوس
  می‌دهد و صفحه‌خوان‌ها نام درست را می‌خوانند.
</p>

<script setup>
import LabelDemo from '../demos/LabelDemo.vue'
import labelDemoCode from '../demos/LabelDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="اتصال برچسب به ورودی" description="با for و id، برچسب و کنترل به هم متصل می‌شوند." :code="labelDemoCode">

  <LabelDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Input, Label } from '@saaze/ui'
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <div class="grid gap-2">
    <Label for="email">ایمیل</Label>
    <Input id="email" v-model="email" type="email" dir="ltr" class="text-left" />
  </div>
</template>
```

## API

| ویژگی     | نوع                   | پیش‌فرض | توضیح                    |
| --------- | --------------------- | ------- | ------------------------ |
| `for`     | `string`              | —       | شناسه کنترل مرتبط        |
| `as`      | `string \| Component` | `label` | عنصر ریشه                |
| `asChild` | `boolean`             | `false` | انتقال ویژگی‌ها به فرزند |
| `class`   | `string`              | —       | کلاس‌های اضافی           |

## برچسب و کنترل‌های غیرورودی

برای `Checkbox` و `Switch` هم می‌توانید از `for` استفاده کنید:

```vue
<template>
  <div class="flex items-center gap-2">
    <Checkbox id="terms" v-model:checked="accepted" />
    <Label for="terms">قوانین را می‌پذیرم</Label>
  </div>
</template>
```

## دسترس‌پذیری

- `for` باید دقیقاً با `id` کنترل یکی باشد.
- اگر نمی‌توانید از `for` استفاده کنید، کنترل را داخل `Label` بگذارید.
- متن برچسب را کوتاه و توصیفی نگه دارید؛ از «اینجا کلیک کنید» پرهیز کنید.
- برای کنترل‌های بدون متن دیداری (مثل دکمه آیکنی) از `aria-label` استفاده کنید.
