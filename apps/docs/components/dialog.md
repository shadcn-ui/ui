# دیالوگ

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Dialog</span>
  <span>Focus trap</span>
</div>

<p class="saaze-lead">
  پنجره مودال برای تأیید، فرم‌های کوتاه و اطلاع‌رسانی. فوکوس داخل دیالوگ حبس می‌شود، بستن با
  <kbd>Escape</kbd> کار می‌کند و کلیک بیرون قابل مدیریت است.
</p>

<script setup>
import DialogDemo from '../demos/DialogDemo.vue'
import dialogDemoCode from '../demos/DialogDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="فرم در دیالوگ" description="دیالوگ به‌صورت پیش‌فرض دکمه بستن فارسی، overlay و انیمیشن ورود دارد." :code="dialogDemoCode">

  <DialogDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@saaze/ui'

const open = ref(false)
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">ایجاد پروژه</Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>پروژه تازه</DialogTitle>
        <DialogDescription>
          نام پروژه را وارد کنید. بعداً می‌توانید اعضای تیم را اضافه کنید.
        </DialogDescription>
      </DialogHeader>

      <DialogFooter>
        <DialogClose as-child>
          <Button variant="outline">انصراف</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button>ایجاد پروژه</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
```

## اجزا

| جزء                 | نقش                                |
| ------------------- | ---------------------------------- |
| `Dialog`            | ریشه و مدیریت وضعیت باز/بسته       |
| `DialogTrigger`     | عنصر بازکننده                      |
| `DialogContent`     | پورتال، overlay، محتوا و دکمه بستن |
| `DialogHeader`      | چیدمان عنوان و توضیح               |
| `DialogTitle`       | عنوان دسترس‌پذیر (الزامی)          |
| `DialogDescription` | توضیح تکمیلی                       |
| `DialogFooter`      | چیدمان اقدام‌ها                    |
| `DialogClose`       | بستن دیالوگ                        |

## API

### Dialog

| ویژگی         | نوع       | پیش‌فرض | توضیح                              |
| ------------- | --------- | ------- | ---------------------------------- |
| `open`        | `boolean` | —       | وضعیت کنترل‌شده؛ با `v-model:open` |
| `defaultOpen` | `boolean` | `false` | وضعیت اولیه                        |
| `modal`       | `boolean` | `true`  | غیرفعال‌کردن تعامل با بیرون        |

| رویداد        | نوع       | توضیح       |
| ------------- | --------- | ----------- |
| `update:open` | `boolean` | تغییر وضعیت |

### DialogContent

| ویژگی        | نوع       | پیش‌فرض | توضیح                         |
| ------------ | --------- | ------- | ----------------------------- |
| `forceMount` | `boolean` | `false` | رندر اجباری برای انیمیشن دستی |
| `trapFocus`  | `boolean` | `true`  | حبس فوکوس داخل محتوا          |
| `class`      | `string`  | —       | کلاس‌های اضافی                |

| رویداد               | توضیح               |
| -------------------- | ------------------- |
| `escapeKeyDown`      | فشردن Escape        |
| `pointerDownOutside` | کلیک بیرون          |
| `interactOutside`    | تعامل بیرون         |
| `openAutoFocus`      | قبل از فوکوس اولیه  |
| `closeAutoFocus`     | قبل از بازگشت فوکوس |

### سایر اجزا

`DialogTrigger`، `DialogClose`، `DialogTitle` و `DialogDescription` ویژگی‌های `as`،
`asChild` و `class` را می‌پذیرند. `DialogHeader` و `DialogFooter` فقط `class` دارند.

## کنترل بستن با کلیک بیرون

برای جلوگیری از بستن ناخواسته فرم، رویداد را متوقف کنید:

```vue
<DialogContent
  @pointer-down-outside="(event) => event.preventDefault()"
  @interact-outside="(event) => event.preventDefault()"
>
  <!-- ... -->
</DialogContent>
```

## دسترس‌پذیری

- `DialogTitle` را همیشه قرار دهید؛ Radix از آن برای نام‌گذاری دیالوگ استفاده می‌کند.
- `DialogDescription` را برای توضیح هدف دیالوگ اضافه کنید.
- دکمه بستن بالای محتوا به‌صورت پیش‌فرض متن پنهان «بستن» دارد.
- فوکوس پس از بسته شدن به عنصر بازکننده برمی‌گردد.
- برای دیالوگ‌های تأیید مخرب، دکمه اصلی را با `variant="destructive"` مشخص کنید.

## پنهان‌کردن دکمه بستن

`DialogContent` (و `SheetContent`) ویژگی `show-close-button` را می‌پذیرند؛ با مقدار `false`
دکمه بستن گوشه حذف می‌شود و می‌توانید `DialogClose` اختصاصی خود را بگذارید.
