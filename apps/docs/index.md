---
layout: home

hero:
  name: سازه UI
  text: رابط کاربری فارسی، از پایه
  tagline: کامپوننت‌های Vue 3 با راست‌به‌چپ اصیل، تقویم جلالی، رقم‌های فارسی و طراحی مبتنی بر Tailwind.
  image:
    src: /logo.svg
    alt: سازه UI
  actions:
    - theme: brand
      text: شروع کنید
      link: /guide/introduction
    - theme: alt
      text: مرور کامپوننت‌ها
      link: /components/button

features:
  - icon: 🧭
    title: راست‌به‌چپ اصیل
    details: چیدمان، فاصله‌ها، منوها و لایه‌های رویی با ویژگی‌های منطقی ساخته شده‌اند؛ نه با وصله‌های جهت ثابت.
  - icon: 🗓️
    title: تقویم جلالی
    details: تقویم و تاریخ‌انتخاب‌کن با شش ردیف ثابت، پیمایش کلیدی، محدوده تاریخ و نمایش کامل فارسی.
  - icon: 🔢
    title: عدد و مبلغ فارسی
    details: تبدیل رقم، قالب‌بندی سه‌رقمی، تومان و ریال، درصد و خلاصه‌سازی اعداد بزرگ.
  - icon: 🧩
    title: مبتنی بر Radix Vue
    details: رفتار دسترس‌پذیر، مدیریت فوکوس و تعامل‌های صفحه‌کلید از دل primitives آزموده‌شده.
  - icon: 🎨
    title: Tailwind و توکن‌ها
    details: متغیرهای CSS، پوسته روشن و تاریک و کلاس‌های منطقی مانند ms، me، ps و pe.
  - icon: ♿
    title: دسترس‌پذیری
    details: برچسب‌های ARIA فارسی، ناوبری صفحه‌کلید و ساختار معنایی در همه کامپوننت‌ها.
---

<script setup>
import HomeShowcase from './.vitepress/theme/HomeShowcase.vue'
</script>

<HomeShowcase />

<section class="mx-auto max-w-6xl px-6 pb-24">
  <div class="grid gap-6 rounded-2xl border bg-card p-8 text-center sm:p-12">
    <h2 class="m-0 text-2xl font-bold">آماده‌اید سازه را بالا ببرید؟</h2>
    <p class="mx-auto m-0 max-w-2xl text-sm leading-8 text-muted-foreground">
      در چند دقیقه نصب کنید، توکن‌های طراحی را به Tailwind وصل کنید و اولین فرم فارسی خود را
      بسازید.
    </p>
    <div class="flex flex-wrap items-center justify-center gap-3">
      <a class="inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90" href="/guide/installation">
        راهنمای نصب
      </a>
      <a class="inline-flex h-10 items-center rounded-md border border-input bg-background px-5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground" href="/guide/utilities">
        ابزارهای فارسی
      </a>
    </div>
  </div>
</section>
