# نصب و راه‌اندازی

<div class="saaze-badges">
  <span>Node.js 20.19+</span>
  <span>Vue 3.5+</span>
  <span>Tailwind 3.4 (اختیاری)</span>
</div>

<p class="saaze-lead">
  سازه UI یک کتابخانه Vue است و با Vite، Nuxt یا هر ابزار مبتنی بر Vite کار می‌کند. در این
  صفحه نصب، بارگذاری استایل و اتصال توکن‌های طراحی را قدم‌به‌قدم انجام می‌دهیم.
</p>

## پیش‌نیازها

- Node.js نسخه ۲۰.۱۹ یا بالاتر
- Vue 3.5 یا بالاتر
- آشنایی مقدماتی با Tailwind CSS (برای سفارشی‌سازی اختیاری است)

## نصب بسته‌ها

::: code-group

```bash [pnpm]
pnpm add @saaze/ui @saaze/utils
```

```bash [npm]
npm install @saaze/ui @saaze/utils
```

```bash [yarn]
yarn add @saaze/ui @saaze/utils
```

:::

`@saaze/utils` شامل تبدیل رقم، قالب‌بندی مبلغ و توابع تقویم جلالی است. اگر فقط از
کامپوننت‌ها استفاده می‌کنید، هنوز هم به‌عنوان وابستگی سازه UI نصب می‌شود؛ اما برای استفاده
مستقیم از توابع، آن را صریحاً اضافه کنید.

## بارگذاری استایل

فایل استایل بسته را یک بار در نقطه ورود برنامه import کنید:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@saaze/ui/style.css'

createApp(App).mount('#app')
```

این فایل شامل توکن‌های رنگ، تایپوگرافی، فونت وزیرمتن و استایل همه کامپوننت‌هاست. اگر
Tailwind را در برنامه خود استفاده می‌کنید، می‌توانید به‌جای آن استایل منبع را وارد کنید و
مراحل بخش Tailwind را دنبال کنید.

## فعال‌کردن راست‌به‌چپ

جهت و زبان سند را روی HTML تنظیم کنید:

```html
<!doctype html>
<html lang="fa-IR" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>برنامه من</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

سپس ریشه برنامه را در `SaazeProvider` بگذارید تا primitiveهای Radix نیز جهت راست‌به‌چپ را
دریافت کنند:

```vue
<!-- App.vue -->
<script setup lang="ts">
import { SaazeProvider } from '@saaze/ui'
</script>

<template>
  <SaazeProvider>
    <RouterView />
  </SaazeProvider>
</template>
```

`SaazeProvider` به‌صورت پیش‌فرض `dir="rtl"` دارد. برای نواحی چپ‌به‌راست (مثلاً یک ویرایشگر
کد) می‌توانید `dir="ltr"` بدهید.

## اتصال Tailwind (اختیاری)

کامپوننت‌های سازه استایل خود را همراه دارند، اما اگر می‌خواهید از توکن‌های رنگ، شعاع گوشه و
انیمیشن‌های سازه در کلاس‌های خودتان استفاده کنید، پیکربندی زیر را اضافه کنید:

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import saaze from '@saaze/ui/tailwind.config'

export default {
  presets: [saaze],
  content: ['./index.html', './src/**/*.{vue,ts}'],
} satisfies Config
```

پس از آن می‌توانید از رنگ‌هایی مانند `bg-primary`، `text-muted-foreground`، `border-border` و
شعاع‌های `rounded-lg` استفاده کنید.

::: tip ترتیب لایه‌ها
اگر Tailwind را در برنامه فعال می‌کنید، `@saaze/ui/style.css` را بعد از استایل اصلی خود
بارگذاری کنید تا توکن‌های سازه روی reset پروژه شما قرار بگیرند.
:::

## سفارشی‌سازی توکن‌ها

رنگ‌ها به‌صورت کانال‌های HSL تعریف شده‌اند. برای تغییر رنگ اصلی کافی است متغیر را بازنویسی
کنید:

```css
/* style.css */
:root {
  --primary: 221 83% 53%;
  --primary-foreground: 0 0% 100%;
  --radius: 0.5rem;
}
```

فهرست کامل متغیرها در `@saaze/ui/theme.css` و فایل منبع `packages/ui/src/styles/theme.css`
قابل مشاهده است.

## اولین کامپوننت

```vue
<script setup lang="ts">
import { Button, Input, Label } from '@saaze/ui'
import { ref } from 'vue'

const phone = ref('')
</script>

<template>
  <form class="grid max-w-sm gap-4">
    <div class="grid gap-2">
      <Label for="phone">شماره موبایل</Label>
      <Input id="phone" v-model="phone" persian-digits placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷" />
    </div>
    <Button type="submit">ادامه</Button>
  </form>
</template>
```

## عیب‌یابی

| نشانه                          | راه‌حل                                                                               |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| استایل‌ها اعمال نمی‌شوند       | مطمئن شوید `@saaze/ui/style.css` در نقطه ورود import شده است.                        |
| منو از سمت اشتباه باز می‌شود   | ریشه برنامه را در `SaazeProvider` بگذارید یا `dir="rtl"` را روی والد منو تنظیم کنید. |
| فونت فارسی بارگذاری نمی‌شود    | import استایل بسته را بررسی کنید؛ فونت وزیرمتن همراه آن منتشر می‌شود.                |
| رقم‌ها فارسی نمی‌شوند          | برای `Input` ویژگی `persian-digits` را فعال کنید.                                    |
| تاریخ میلادی نمایش داده می‌شود | از `DatePicker`، `Calendar` یا `formatJalali` استفاده کنید.                          |
