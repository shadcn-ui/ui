<div dir="rtl">

# سازه UI

کتابخانه کامپوننت‌های **راست‌به‌چپ** و **فارسی** برای Vue 3؛ ساخته‌شده با TypeScript، Tailwind CSS و Radix Vue.

سازه UI به‌جای وصله‌کردن RTL روی یک کتابخانه چپ‌به‌راست، از ابتدا با فرض `dir="rtl"`، تقویم جلالی، رقم‌های فارسی و تایپوگرافی وزیرمتن طراحی شده است.

<p>
  <img alt="Vue 3.5" src="https://img.shields.io/badge/Vue-3.5-42b883?logo=vue.js&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-3178c6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img alt="RTL first" src="https://img.shields.io/badge/RTL-first-0ea5e9" />
  <img alt="License MIT" src="https://img.shields.io/badge/License-MIT-22c55e" />
</p>

## ویژگی‌ها

- **چیدمان منطقی:** استفاده از `ms-*`، `me-*`، `ps-*`، `pe-*`، `start-*` و `end-*` به‌جای خواص فیزیکی.
- **رفتار درست RTL:** منوها، پاپ‌اورها و زیرمنوها با جهت و ترازبندی منطقی باز می‌شوند.
- **فارسی‌سازی واقعی:** تقویم جلالی، نام ماه‌ها و روزهای هفته، رقم‌های فارسی، جداکننده هزارگان و قالب‌بندی تومان.
- **دسترس‌پذیری:** برچسب‌های ARIA فارسی، مدیریت فوکوس، ناوبری با صفحه‌کلید و ساختار معنایی.
- **پوسته‌پذیر:** توکن‌های CSS برای رنگ، شعاع گوشه و تایپوگرافی، همراه با حالت روشن و تاریک.
- **مستندات زنده:** VitePress با پیش‌نمایش تعاملی، کد قابل کپی و راهنمای کامل RTL.

## کامپوننت‌ها

| کامپوننت        | توضیح                                        |
| --------------- | -------------------------------------------- |
| `Button`        | گونه‌ها، اندازه‌ها، آیکن و حالت غیرفعال      |
| `Input`         | ورودی متنی با تبدیل خودکار رقم‌های فارسی     |
| `Label`         | اتصال دسترس‌پذیر برچسب به کنترل‌های فرم      |
| `Checkbox`      | انتخاب چندگانه، حالت نیمه‌انتخاب و غیرفعال   |
| `Switch`        | کلید روشن/خاموش با حرکت منطقی دسته           |
| `Dialog`        | پنجره مودال با تله فوکوس و بستن با Escape    |
| `DropdownMenu`  | منو، زیرمنو، آیتم انتخابی و ترازبندی RTL     |
| `Calendar`      | تقویم جلالی شش‌ردیفی با ناوبری کلیدی         |
| `DatePicker`    | انتخاب تاریخ جلالی در پاپ‌اور                |
| `Pagination`    | صفحه‌بندی فارسی با ارقام و برچسب‌های بومی    |
| `DataTable`     | مرتب‌سازی، جستجو، صفحه‌بندی و قالب‌بندی سلول |
| `SaazeProvider` | تنظیم جهت و زمینه مشترک برای primitiveها     |

## پیش‌نیازها

- Node.js 20.19 یا بالاتر
- pnpm 9 یا بالاتر
- Vue 3.5 یا بالاتر

## شروع کار با مخزن

```bash
git clone https://github.com/ReyhaneENS/saaze-ui.git
cd saaze-ui
pnpm install
pnpm dev
```

مستندات روی [http://localhost:5173](http://localhost:5173) بالا می‌آید.

## استفاده

ریشه برنامه را در `SaazeProvider` بگذارید و استایل بسته را یک بار import کنید:

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import '@saaze/ui/style.css'

createApp(App).mount('#app')
```

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

سپس کامپوننت‌ها را مستقیم import کنید:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { Button, DatePicker, Input, Label } from '@saaze/ui'

const phone = ref('')
const birthday = ref<Date | null>(null)
</script>

<template>
  <form class="grid max-w-sm gap-4">
    <div class="grid gap-2">
      <Label for="phone">شماره موبایل</Label>
      <Input id="phone" v-model="phone" persian-digits placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷" />
    </div>

    <div class="grid gap-2">
      <Label>تاریخ تولد</Label>
      <DatePicker v-model="birthday" />
    </div>

    <Button type="submit">ادامه</Button>
  </form>
</template>
```

### ابزارهای فارسی و جلالی

```ts
import { formatJalali, formatToman, gregorianToJalali, toPersianDigits } from '@saaze/utils'

toPersianDigits('1405') // ۱۴۰۵
formatToman(2_450_000) // ۲,۴۵۰,۰۰۰ تومان
formatJalali(new Date(), { pattern: 'YYYY/MM/DD' }) // ۱۴۰۵/۰۸/۰۷
gregorianToJalali(new Date()) // { year: 1405, month: 8, day: 7 }
```

### اتصال Tailwind (اختیاری)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'
import saaze from '@saaze/ui/tailwind.config'

export default {
  presets: [saaze],
  content: ['./index.html', './src/**/*.{vue,ts}'],
} satisfies Config
```

## اسکریپت‌ها

| فرمان               | کار                             |
| ------------------- | ------------------------------- |
| `pnpm dev`          | اجرای مستندات با پیش‌نمایش زنده |
| `pnpm build`        | ساخت utils، UI و مستندات        |
| `pnpm typecheck`    | بررسی نوع‌ها در همه بسته‌ها     |
| `pnpm test`         | اجرای تست‌های utils             |
| `pnpm format`       | قالب‌بندی با Prettier           |
| `pnpm format:check` | بررسی قالب‌بندی                 |

## ساختار مخزن

```text
saaze-ui/
├─ apps/
│  └─ docs/            # مستندات VitePress و پیش‌نمایش‌های زنده
├─ packages/
│  ├─ ui/              # کامپوننت‌های Vue و توکن‌های طراحی
│  └─ utils/           # ابزارهای عدد، پول و تاریخ جلالی
├─ pnpm-workspace.yaml
└─ package.json
```

## مشارکت

- برای گزارش باگ یا پیشنهاد ویژگی، یک Issue باز کنید.
- پیش از ارسال Pull Request، `pnpm typecheck`، `pnpm test` و `pnpm build` را اجرا کنید.
- تغییرات ظاهری را در حالت راست‌به‌چپ و عرض‌های موبایل بررسی کنید.

## مجوز

این پروژه تحت [مجوز MIT](./LICENSE) منتشر شده است.

</div>
