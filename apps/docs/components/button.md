# دکمه

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Primitive</span>
  <span>Tailwind</span>
</div>

<p class="saaze-lead">
  دکمه پایه‌ای برای اقدام‌ها و فرم‌ها. هفت گونه ظاهری، پنج اندازه و پشتیبانی از رندر به‌عنوان
  عنصر یا کامپوننت دلخواه را ارائه می‌دهد.
</p>

<script setup>
import ButtonDemo from '../demos/ButtonDemo.vue'
import buttonDemoCode from '../demos/ButtonDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="گونه‌ها، اندازه‌ها و حالت‌ها" description="همه گونه‌ها راست‌به‌چپ و با فاصله منطقی بین آیکن و متن کار می‌کنند." :code="buttonDemoCode">

  <ButtonDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Button } from '@saaze/ui'
</script>

<template>
  <Button>ثبت سفارش</Button>
  <Button variant="outline" size="sm">ویرایش</Button>
  <Button variant="destructive">حذف</Button>
</template>
```

## گونه‌ها

| مقدار         | ظاهر                 | کاربرد پیشنهادی                      |
| ------------- | -------------------- | ------------------------------------ |
| `default`     | پس‌زمینه اصلی        | اقدام اصلی صفحه یا فرم               |
| `secondary`   | پس‌زمینه ملایم       | اقدام ثانویه                         |
| `outline`     | حاشیه‌دار            | اقدام خنثی یا ابزارها                |
| `ghost`       | بدون پس‌زمینه        | منو، نوار ابزار و اقدام‌های کم‌اهمیت |
| `link`        | شبیه پیوند           | هدایت به صفحه دیگر                   |
| `soft`        | پس‌زمینه کم‌رنگ اصلی | تأکید ملایم                          |
| `destructive` | قرمز                 | حذف و اقدام خطرناک                   |

## اندازه‌ها

| مقدار     | ارتفاع   | کاربرد                       |
| --------- | -------- | ---------------------------- |
| `sm`      | ۳۲ پیکسل | جدول، نوار ابزار و فرم فشرده |
| `default` | ۴۰ پیکسل | حالت معمول                   |
| `lg`      | ۴۴ پیکسل | فراخوان اصلی                 |
| `icon`    | ۴۰×۴۰    | دکمه فقط آیکن                |
| `icon-sm` | ۳۲×۳۲    | آیکن فشرده                   |

## API

| ویژگی     | نوع                                                                       | پیش‌فرض   | توضیح                    |
| --------- | ------------------------------------------------------------------------- | --------- | ------------------------ |
| `variant` | `default \| secondary \| outline \| ghost \| link \| soft \| destructive` | `default` | گونه ظاهری               |
| `size`    | `default \| sm \| lg \| icon \| icon-sm`                                  | `default` | اندازه                   |
| `type`    | `button \| submit \| reset`                                               | `button`  | نوع دکمه HTML            |
| `as`      | `string \| Component`                                                     | `button`  | عنصر ریشه                |
| `asChild` | `boolean`                                                                 | `false`   | انتقال ویژگی‌ها به فرزند |
| `class`   | `string`                                                                  | —         | کلاس‌های اضافی           |

سایر ویژگی‌های HTML مانند `disabled`، `aria-label` و رویداد `@click` به عنصر ریشه منتقل
می‌شوند.

## رندر به‌عنوان پیوند

وقتی دکمه باید ناوبری کند، از `asChild` استفاده کنید تا لینک واقعی و دسترس‌پذیر داشته باشید:

```vue
<template>
  <Button as-child variant="outline">
    <RouterLink to="/orders">سفارش‌های من</RouterLink>
  </Button>
</template>
```

## آیکن‌ها

آیکن‌ها به‌صورت خودکار اندازه ۱۶ پیکسل می‌گیرند و از فشرده‌شدن جلوگیری می‌شود. در دکمه‌های
فقط آیکن، همیشه `aria-label` بدهید:

```vue
<template>
  <Button size="icon" aria-label="افزودن سفارش">
    <Plus aria-hidden="true" />
  </Button>
</template>
```

در چیدمان راست‌به‌چپ، آیکن «مرحله بعد» باید به سمت چپ باشد:

```vue
<Button>
  مرحله بعد
  <ArrowLeft aria-hidden="true" />
</Button>
```

## دسترس‌پذیری

- دکمه به‌صورت پیش‌فرض `type="button"` دارد تا فرم‌ها ناخواسته ارسال نشوند.
- حلقه فوکوس با `focus-visible` نمایش داده می‌شود.
- برای دکمه‌های آیکنی، متن جایگزین با `aria-label` یا `sr-only` فراهم کنید.
- حالت `disabled` هم ظاهر و هم تعامل اشاره‌گر را غیرفعال می‌کند.
