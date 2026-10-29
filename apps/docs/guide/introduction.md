# درباره سازه UI

<div class="saaze-badges">
  <span>Vue 3.5</span>
  <span>TypeScript</span>
  <span>Tailwind CSS</span>
  <span>Radix Vue</span>
  <span>RTL-first</span>
</div>

<p class="saaze-lead">
  سازه UI یک کتابخانه کامپوننت برای ساخت رابط‌های کاربری فارسی و راست‌به‌چپ با Vue 3 است.
  همه‌چیز از ابتدا با فرض <code>dir="rtl"</code>، تقویم جلالی و رقم‌های فارسی طراحی شده است.
</p>

## چرا سازه؟

بیشتر کتابخانه‌های کامپوننت برای زبان‌های چپ‌به‌راست ساخته می‌شوند و بعد با چند کلاس CSS به راست‌به‌چپ تبدیل می‌شوند. نتیجه معمولاً منوهایی است که از سمت اشتباه باز می‌شوند، فاصله‌های نامتقارن، تاریخ میلادی و اعدادی که با متن فارسی هم‌خوان نیستند.

سازه UI این لایه‌ها را از پایه کنار هم قرار می‌دهد:

- **چیدمان منطقی:** فاصله‌ها و ترازبندی با `ms-*`، `me-*`، `ps-*`، `pe-*`، `start-*` و `end-*` نوشته می‌شوند.
- **رفتار درست RTL:** منوی کشویی و تاریخ‌انتخاب‌کن، ترازبندی منطقی `start` و `end` را بر اساس جهت به لبه درست نسبت می‌دهند.
- **فارسی‌سازی واقعی:** تقویم جلالی، نام ماه‌ها و روزهای هفته، رقم‌های فارسی و قالب‌بندی تومان و ریال.
- **دسترس‌پذیری:** برچسب‌های ARIA فارسی، مدیریت فوکوس، ناوبری با صفحه‌کلید و ساختار معنایی.
- **پوسته‌پذیر:** توکن‌های CSS برای رنگ، شعاع گوشه و تایپوگرافی، همراه با حالت روشن و تاریک.

## کامپوننت‌ها

<div class="grid gap-3 sm:grid-cols-2">

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/button">
  <strong class="block text-sm text-foreground">دکمه</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">گونه‌ها، اندازه‌ها، آیکن و حالت‌های غیرفعال</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/input">
  <strong class="block text-sm text-foreground">ورودی</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">ورودی متنی با تبدیل خودکار رقم‌های فارسی</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/label">
  <strong class="block text-sm text-foreground">برچسب</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">اتصال دسترس‌پذیر برچسب به کنترل‌های فرم</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/checkbox">
  <strong class="block text-sm text-foreground">چک‌باکس</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">انتخاب چندگانه، حالت نیمه‌انتخاب و غیرفعال</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/switch">
  <strong class="block text-sm text-foreground">سوییچ</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">کلید روشن/خاموش با حرکت منطقی دسته</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/dialog">
  <strong class="block text-sm text-foreground">دیالوگ</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">پنجره مودال با فوکوس تله‌ای و بستن با Escape</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/dropdown-menu">
  <strong class="block text-sm text-foreground">منوی کشویی</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">منو، زیرمنو، آیتم انتخابی و ترازبندی RTL</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/calendar">
  <strong class="block text-sm text-foreground">تقویم جلالی</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">گرید شش‌ردیفی، پیمایش کلیدی و محدوده تاریخ</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/date-picker">
  <strong class="block text-sm text-foreground">تاریخ‌انتخاب‌کن</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">انتخاب تاریخ جلالی در یک پاپ‌اور</span>
</a>

<a class="rounded-xl border bg-card p-4 no-underline transition-colors hover:border-primary" href="/components/data-table">
  <strong class="block text-sm text-foreground">جدول داده</strong>
  <span class="mt-1 block text-xs leading-6 text-muted-foreground">مرتب‌سازی، صفحه‌بندی فارسی و قالب‌بندی سلول</span>
</a>

</div>

## پشته فنی

| لایه        | انتخاب                                      |
| ----------- | ------------------------------------------- |
| فریم‌ورک    | Vue 3 با Composition API و `<script setup>` |
| زبان        | TypeScript با strict mode                   |
| Primitiveها | Radix Vue                                   |
| استایل      | Tailwind CSS 3.4 و توکن‌های CSS             |
| آیکن‌ها     | Lucide Vue                                  |
| تاریخ       | `jalaali-js` با لایه جلالی اختصاصی          |
| مستندات     | VitePress                                   |

## ساختار مخزن

```text
saaze-ui/
├─ apps/
│  └─ docs/            # همین مستندات
├─ packages/
│  ├─ ui/              # کامپوننت‌ها
│  └─ utils/           # ابزارهای عدد، پول و تاریخ
└─ pnpm-workspace.yaml
```

## گام بعدی

- [نصب و راه‌اندازی](./installation)
- [راست‌به‌چپ و Tailwind](./rtl)
- [ابزارهای فارسی و جلالی](./utilities)
