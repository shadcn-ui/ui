# راست‌به‌چپ و Tailwind

<div class="saaze-badges">
  <span>dir="rtl"</span>
  <span>Logical properties</span>
  <span>Radix Vue</span>
</div>

<p class="saaze-lead">
  راست‌به‌چپ در سازه UI یک حالت اضافه نیست؛ پیش‌فرض است. در این صفحه می‌بینید چیدمان،
  ترازبندی و رفتار منوها چگونه بدون کلاس‌های جهت ثابت نوشته می‌شوند.
</p>

## جهت سند

مرورگر برای انتخاب جهت متن، فاصله‌ها و اسکرول از `dir` روی `html` استفاده می‌کند:

```html
<html lang="fa-IR" dir="rtl"></html>
```

در Vue می‌توانید برای یک ناحیه کوچک جهت را عوض کنید:

```vue
<template>
  <div dir="rtl">
    <ContactForm />
  </div>

  <div dir="ltr" class="mt-6">
    <CodeEditor />
  </div>
</template>
```

::: tip چرا Provider لازم است؟
`dir` روی HTML چیدمان CSS را درست می‌کند، اما Radix Vue برای محاسبه موقعیت لایه‌های رویی
به `dir` در context نیاز دارد. `SaazeProvider` این مقدار را با پیش‌فرض `rtl` فراهم می‌کند.
:::

## ویژگی‌های منطقی Tailwind

به‌جای `ml`، `mr`، `pl` و `pr` از نسخه‌های منطقی استفاده کنید:

| نیاز            | کلاس منطقی     | معادل فیزیکی در RTL      |
| --------------- | -------------- | ------------------------ |
| فاصله از شروع   | `ms-4`         | `margin-right: 1rem`     |
| فاصله از پایان  | `me-4`         | `margin-left: 1rem`      |
| پدینگ شروع      | `ps-3`         | `padding-right: 0.75rem` |
| پدینگ پایان     | `pe-3`         | `padding-left: 0.75rem`  |
| چسبیدن به شروع  | `start-0`      | `right: 0`               |
| چسبیدن به پایان | `end-0`        | `left: 0`                |
| ترازبندی متن    | `text-start`   | `text-align: right`      |
| حاشیه شروع      | `border-s`     | `border-right`           |
| گوشه شروع       | `rounded-s-lg` | گوشه‌های راست            |

همین قاعده برای `scroll-ms-*`، `scroll-ps-*` و `rounded-ss-*`/`rounded-ee-*` هم برقرار است. برای آیکون‌های
جهت‌دار (مانند فلش «بعدی») از نسخه LTR آیکون به‌همراه `rtl:rotate-180` استفاده کنید.

::: warning از space-x استفاده نکنید
کلاس `space-x-*` در Tailwind 3 فیزیکی است و در RTL فاصله را از سمت اشتباه اعمال می‌کند.
به‌جای آن از `gap-*` در flex یا grid استفاده کنید.
:::

## ترازبندی منطقی در لایه‌های رویی

Floating UI جهت عنصر شناور را می‌خواند و برای چیدمان‌های عمودی، لبه منطقی را خودش انتخاب
می‌کند. سازه UI مقدار `align` را منطقی نگه می‌دارد، بنابراین همان کد در RTL و LTR درست
کار می‌کند:

```vue
<template>
  <!-- در RTL، start یعنی لبه راست منو با لبه راست دکمه هم‌تراز می‌شود -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">حساب من</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem>پروفایل</DropdownMenuItem>
      <DropdownMenuItem>تنظیمات</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <!-- end یعنی لبه چپ منو با لبه چپ دکمه هم‌تراز می‌شود -->
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">مرتب‌سازی</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>جدیدترین</DropdownMenuItem>
      <DropdownMenuItem>قدیمی‌ترین</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

همین رفتار برای `DatePicker` هم وجود دارد:

```vue
<DatePicker v-model="date" align="start" />
```

مقدار `side` (بالا، پایین، چپ، راست) فیزیکی است؛ چون جهت باز شدن عمودی/افقی را مشخص می‌کند
و معمولاً به اندازه فضای صفحه بستگی دارد.

## آیکن‌ها و جهت حرکت

آیکن‌های خطی مثل فلش و شورون باید جهت را دنبال کنند. سازه UI در دکمه‌های ناوبری تقویم و
صفحه‌بندی این کار را انجام می‌دهد، اما در دکمه‌های دلخواه شما باید آیکن مناسب را انتخاب
کنید:

```vue
<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
</script>

<template>
  <!-- در RTL، «مرحله بعد» به سمت چپ است -->
  <Button>
    مرحله بعد
    <ArrowLeft aria-hidden="true" />
  </Button>
</template>
```

## نمونه فرم راست‌به‌چپ

```vue
<template>
  <form class="grid max-w-md gap-4" dir="rtl">
    <div class="grid gap-2">
      <Label for="full-name">نام و نام خانوادگی</Label>
      <Input id="full-name" placeholder="سارا احمدی" />
    </div>

    <div class="grid gap-2">
      <Label for="amount">مبلغ</Label>
      <Input id="amount" persian-digits placeholder="۲٬۵۰۰٬۰۰۰" />
    </div>

    <div class="flex items-center justify-between gap-3">
      <Label for="newsletter">خبرنامه</Label>
      <Switch id="newsletter" v-model:checked="subscribed" />
    </div>

    <Button class="w-full">ثبت</Button>
  </form>
</template>
```

## چک‌لیست RTL

- `dir="rtl"` و `lang="fa-IR"` روی HTML تنظیم شده است.
- برنامه داخل `SaazeProvider` قرار دارد.
- از `ms`، `me`، `ps`، `pe`، `start` و `end` استفاده می‌شود.
- به‌جای `space-x-*` از `gap-*` استفاده شده است.
- آیکن‌های جهت‌دار در RTL برعکس شده‌اند.
- تاریخ‌ها با `formatJalali` یا کامپوننت‌های تقویم نمایش داده می‌شوند.
- عددها با `toPersianDigits` یا `formatNumber` فارسی شده‌اند.
- ترازبندی منوها با `align="start"` و `align="end"` منطقی نوشته شده است.
