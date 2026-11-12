# منوی کشویی

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Menu</span>
  <span>RTL align</span>
</div>

<p class="saaze-lead">
  منو برای اقدام‌ها و گزینه‌های ثانویه. منوی سازه به‌صورت پیش‌فرض راست‌به‌چپ است و
  ترازبندی <code>start</code> و <code>end</code> را بر اساس جهت به لبه درست نسبت می‌دهد.
</p>

<script setup>
import DropdownMenuDemo from '../demos/DropdownMenuDemo.vue'
import dropdownMenuDemoCode from '../demos/DropdownMenuDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="منوی حساب کاربری" description="آیتم معمولی، زیرمنو، چک‌باکس، گروه رادیویی و آیتم غیرفعال." :code="dropdownMenuDemoCode">

  <DropdownMenuDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@saaze/ui'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">حساب من</Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent class="w-56">
      <DropdownMenuLabel>حساب من</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem>پروفایل</DropdownMenuItem>
      <DropdownMenuItem>تنظیمات</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="text-destructive">خروج</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
```

## ترازبندی در راست‌به‌چپ

`align` یک مقدار **منطقی** است:

- `align="start"` → در RTL لبه راست منو با لبه راست دکمه هم‌تراز می‌شود.
- `align="center"` → وسط.
- `align="end"` → در RTL لبه چپ منو با لبه چپ دکمه هم‌تراز می‌شود.

```vue
<DropdownMenuContent align="end" :side-offset="6">
  <DropdownMenuItem>جدیدترین</DropdownMenuItem>
  <DropdownMenuItem>قدیمی‌ترین</DropdownMenuItem>
</DropdownMenuContent>
```

مقدار `side` فیزیکی است: `top`، `right`، `bottom` و `left`.

## اجزا

| جزء                        | نقش                  |
| -------------------------- | -------------------- |
| `DropdownMenu`             | ریشه و جهت           |
| `DropdownMenuTrigger`      | عنصر بازکننده        |
| `DropdownMenuContent`      | پورتال و پنل منو     |
| `DropdownMenuGroup`        | گروه آیتم‌ها         |
| `DropdownMenuItem`         | آیتم قابل کلیک       |
| `DropdownMenuLabel`        | عنوان گروه           |
| `DropdownMenuSeparator`    | جداکننده             |
| `DropdownMenuShortcut`     | نمایش کلید میانبر    |
| `DropdownMenuCheckboxItem` | آیتم چک‌باکسی        |
| `DropdownMenuRadioGroup`   | گروه انتخاب تک‌گزینه |
| `DropdownMenuRadioItem`    | گزینه گروه رادیویی   |
| `DropdownMenuSub`          | زیرمنو               |
| `DropdownMenuSubTrigger`   | بازکننده زیرمنو      |
| `DropdownMenuSubContent`   | پنل زیرمنو           |

## API

### DropdownMenu

| ویژگی         | نوع              | پیش‌فرض | توضیح                              |
| ------------- | ---------------- | ------- | ---------------------------------- |
| `open`        | `boolean`        | —       | وضعیت کنترل‌شده؛ با `v-model:open` |
| `defaultOpen` | `boolean`        | `false` | وضعیت اولیه                        |
| `modal`       | `boolean`        | `true`  | رفتار مودال                        |
| `dir`         | `"rtl" \| "ltr"` | `"rtl"` | جهت منو                            |

### DropdownMenuContent

| ویژگی              | نوع                                      | پیش‌فرض    | توضیح                         |
| ------------------ | ---------------------------------------- | ---------- | ----------------------------- |
| `align`            | `"start" \| "center" \| "end"`           | `"start"`  | ترازبندی منطقی                |
| `side`             | `"top" \| "right" \| "bottom" \| "left"` | `"bottom"` | سمت باز شدن                   |
| `sideOffset`       | `number`                                 | `4`        | فاصله از عنصر بازکننده        |
| `alignOffset`      | `number`                                 | `0`        | جابه‌جایی ترازبندی            |
| `avoidCollisions`  | `boolean`                                | `true`     | جلوگیری از برخورد با لبه صفحه |
| `collisionPadding` | `number`                                 | `0`        | حاشیه امن صفحه                |
| `class`            | `string`                                 | —          | کلاس‌های اضافی                |

### DropdownMenuItem

| ویژگی       | نوع       | پیش‌فرض | توضیح                                      |
| ----------- | --------- | ------- | ------------------------------------------ |
| `disabled`  | `boolean` | `false` | غیرفعال                                    |
| `inset`     | `boolean` | `false` | تورفتگی برای هم‌ترازی با آیتم‌های نشان‌دار |
| `textValue` | `string`  | —       | متن جستجوی تایپ‌ای‌هد                      |
| `class`     | `string`  | —       | کلاس‌های اضافی                             |

### DropdownMenuCheckboxItem

| ویژگی      | نوع       | پیش‌فرض | توضیح                              |
| ---------- | --------- | ------- | ---------------------------------- |
| `checked`  | `boolean` | `false` | وضعیت انتخاب؛ با `v-model:checked` |
| `disabled` | `boolean` | `false` | غیرفعال                            |
| `inset`    | `boolean` | `false` | تورفتگی                            |

### DropdownMenuRadioGroup و RadioItem

`RadioGroup` با `v-model` مقدار رشته‌ای را نگه می‌دارد. هر `RadioItem` به `value` یکتا نیاز
دارد:

```vue
<DropdownMenuRadioGroup v-model="theme">
  <DropdownMenuRadioItem value="light">روشن</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="dark">تاریک</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```

## کلیدهای میانبر

`DropdownMenuShortcut` فقط نمایشی است و کلیدها را ثبت نمی‌کند. برای اتصال واقعی، از
`useEventListener` یا میانبرهای برنامه خود استفاده کنید:

```vue
<DropdownMenuItem>
  ذخیره
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
```

## دسترس‌پذیری

- `DropdownMenuTrigger` را با `as-child` روی `Button` بگذارید تا نقش `button` حفظ شود.
- منو با کلیدهای جهت‌دار، `Enter`، `Escape` و جستجوی تایپ‌ای‌هد کار می‌کند.
- فوکوس پس از بسته شدن به عنصر بازکننده برمی‌گردد.
- برای آیتم‌های فقط آیکنی، `aria-label` یا متن پنهان اضافه کنید.
- آیتم خطرناک را با رنگ `destructive` و متن روشن مشخص کنید.

## گزینه خطرناک

برای اقدام‌های برگشت‌ناپذیر از `variant="destructive"` روی `DropdownMenuItem` (و
`ContextMenuItem`) استفاده کنید:

```vue
<DropdownMenuItem variant="destructive">حذف پروژه</DropdownMenuItem>
```
