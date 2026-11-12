# سونر

اعلان‌های انباشته و زیبا بر پایه [vue-sonner](https://vue-sonner.vercel.app)، با جهت راست‌به‌چپ و رنگ‌های تم سازه. جهت از `SaazeProvider` خوانده می‌شود و جایگاه پیش‌فرض گوشه پایین در لبه پایانی (چپ در RTL) است.

<script setup>
import SonnerDemo from '../demos/SonnerDemo.vue'
import demoCode from '../demos/SonnerDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="انواع اعلان" description="اعلان ساده با اقدام، موفقیت، خطا و اعلان وابسته به Promise." :code="demoCode">

  <SonnerDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Sonner, sonner } from '@saaze/ui'
</script>

<template>
  <!-- یک‌بار در ریشه برنامه -->
  <Sonner rich-colors />

  <Button @click="sonner.success('تغییرات ذخیره شد.')">ذخیره</Button>
</template>
```

## اجزا

`Sonner` همه ویژگی‌های `Toaster` در vue-sonner (`position`، `richColors`، `closeButton`، `duration`، `expand` و …) را می‌پذیرد. تابع `sonner` همان `toast` در vue-sonner است و متدهای `success`، `error`، `info`، `warning`، `promise` و `dismiss` را دارد؛ نام آن برای جلوگیری از تداخل با تابع `toast` در [اعلان](/components/toast) متفاوت است.
