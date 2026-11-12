# صفحه‌بندی

<div class="saaze-badges">
  <span>Persian digits</span>
  <span>RTL</span>
  <span>Ellipsis</span>
</div>

<p class="saaze-lead">
  صفحه‌بندی با شماره‌های فارسی، برچسب «قبلی/بعدی»، حذف هوشمند صفحه‌های میانی و آیکن‌های
  جهت‌دار راست‌به‌چپ. این کامپوننت در <code>DataTable</code> هم استفاده می‌شود.
</p>

<script setup>
import PaginationDemo from '../demos/PaginationDemo.vue'
import paginationDemoCode from '../demos/PaginationDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="صفحه‌بندی کامل" description="صفحه فعال با aria-current مشخص می‌شود و شماره‌ها فارسی هستند." :code="paginationDemoCode">

  <PaginationDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Pagination } from '@saaze/ui'
import { ref } from 'vue'

const page = ref(1)
</script>

<template>
  <Pagination v-model:page="page" :page-count="12" />
</template>
```

## API

| ویژگی           | نوع              | پیش‌فرض       | توضیح                          |
| --------------- | ---------------- | ------------- | ------------------------------ |
| `page`          | `number`         | `1`           | صفحه فعلی؛ با `v-model:page`   |
| `pageCount`     | `number`         | `1`           | تعداد کل صفحه‌ها               |
| `siblingCount`  | `number`         | `1`           | تعداد صفحه‌های اطراف صفحه فعلی |
| `disabled`      | `boolean`        | `false`       | غیرفعال‌کردن همه دکمه‌ها       |
| `dir`           | `"rtl" \| "ltr"` | `"rtl"`       | جهت آیکن‌ها                    |
| `showLabels`    | `boolean`        | `true`        | نمایش متن قبلی/بعدی            |
| `previousLabel` | `string`         | `"قبلی"`      | متن دکمه قبلی                  |
| `nextLabel`     | `string`         | `"بعدی"`      | متن دکمه بعدی                  |
| `ariaLabel`     | `string`         | `"صفحه‌بندی"` | نام ناوبری                     |
| `class`         | `string`         | —             | کلاس‌های اضافی                 |

### رویدادها

| رویداد        | نوع      | توضیح                            |
| ------------- | -------- | -------------------------------- |
| `update:page` | `number` | تغییر صفحه؛ با `v-model:page`    |
| `change`      | `number` | همان مقدار برای شنونده‌های اضافی |

## نمایش فشرده

برای نوار ابزار یا صفحه‌های کوچک، برچسب متنی را حذف کنید:

```vue
<Pagination v-model:page="page" :page-count="20" :show-labels="false" />
```

## محاسبه صفحه‌های میانی

با `siblingCount` تعداد صفحه‌های نمایش‌داده‌شده اطراف صفحه فعلی را کنترل کنید:

```vue
<Pagination v-model:page="page" :page-count="30" :sibling-count="2" />
```

وقتی فاصله زیاد شود، به‌جای صفحه‌های میانی «…» نمایش داده می‌شود.

## دسترس‌پذیری

- ناوبری با `nav` و `aria-label` مشخص شده است.
- صفحه فعال `aria-current="page"` دارد.
- هر دکمه شماره، `aria-label="صفحه ۱۲"` فارسی دارد.
- دکمه‌های قبلی و بعدی در ابتدا و انتهای بازه غیرفعال می‌شوند.

## اجزای ترکیب‌پذیر

اگر به کنترل کامل نشانه‌گذاری نیاز دارید (مثلاً لینک‌های واقعی برای مسیریاب)، از اجزای
هم‌نام shadcn استفاده کنید. فلش‌ها در RTL خودکار آینه می‌شوند:

```vue
<PaginationRoot>
  <PaginationContent>
    <PaginationItem><PaginationPrevious href="?page=1" /></PaginationItem>
    <PaginationItem><PaginationLink href="?page=1">۱</PaginationLink></PaginationItem>
    <PaginationItem><PaginationLink href="?page=2" is-active>۲</PaginationLink></PaginationItem>
    <PaginationItem><PaginationEllipsis /></PaginationItem>
    <PaginationItem><PaginationNext href="?page=3" /></PaginationItem>
  </PaginationContent>
</PaginationRoot>
```
