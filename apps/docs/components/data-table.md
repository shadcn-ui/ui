# جدول داده

<div class="saaze-badges">
  <span>Sorting</span>
  <span>Pagination</span>
  <span>Jalali dates</span>
  <span>Slots</span>
</div>

<p class="saaze-lead">
  جدول داده با مرتب‌سازی ستون‌ها، صفحه‌بندی فارسی، نمایش خودکار تاریخ جلالی و مبلغ تومان.
  برای سلول‌های دلخواه، از اسلات‌های نام‌دار استفاده کنید.
</p>

<script setup>
import DataTableDemo from '../demos/DataTableDemo.vue'
import dataTableDemoCode from '../demos/DataTableDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="فهرست فاکتورها" description="جستجو، مرتب‌سازی، صفحه‌بندی فارسی و نشان وضعیت با اسلات سلول." :code="dataTableDemoCode">

  <DataTableDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { DataTable, type DataTableColumn } from '@saaze/ui'
import { formatToman, jalaliToGregorian } from '@saaze/utils'

interface Invoice {
  id: string
  customer: string
  date: Date
  amount: number
}

const rows: Invoice[] = [
  {
    id: 'SZ-1405-001',
    customer: 'سارا احمدی',
    date: jalaliToGregorian({ year: 1405, month: 8, day: 6 }),
    amount: 2_450_000,
  },
]

const columns: DataTableColumn<Invoice>[] = [
  { key: 'id', header: 'شماره', sortable: true },
  { key: 'customer', header: 'مشتری', sortable: true },
  { key: 'date', header: 'تاریخ', sortable: true },
  {
    key: 'amount',
    header: 'مبلغ',
    sortable: true,
    align: 'end',
    format: (value) => formatToman(Number(value)),
  },
]
</script>

<template>
  <DataTable :data="rows" :columns="columns" :page-size="5" row-key="id" />
</template>
```

## ستون‌ها

هر ستون یک `DataTableColumn<Row>` است:

| فیلد           | نوع                            | پیش‌فرض   | توضیح                      |
| -------------- | ------------------------------ | --------- | -------------------------- |
| `key`          | `string`                       | —         | کلید یکتا و کلید فیلد ردیف |
| `header`       | `string`                       | —         | عنوان ستون                 |
| `accessor`     | `(row) => unknown`             | —         | استخراج مقدار سفارشی       |
| `sortable`     | `boolean`                      | `false`   | فعال‌کردن مرتب‌سازی        |
| `align`        | `"start" \| "center" \| "end"` | `"start"` | ترازبندی منطقی             |
| `format`       | `(value, row) => string`       | —         | قالب‌بندی سفارشی سلول      |
| `hideOnMobile` | `boolean`                      | `false`   | پنهان در صفحه کوچک         |
| `class`        | `string`                       | —         | کلاس سلول‌های بدنه         |
| `headerClass`  | `string`                       | —         | کلاس سرستون                |

اگر `accessor` نداشته باشید، مقدار از `row[column.key]` خوانده می‌شود.

## API

| ویژگی              | نوع                                               | پیش‌فرض                            | توضیح              |
| ------------------ | ------------------------------------------------- | ---------------------------------- | ------------------ |
| `data`             | `Row[]`                                           | —                                  | ردیف‌ها            |
| `columns`          | `DataTableColumn<Row>[]`                          | —                                  | تعریف ستون‌ها      |
| `pageSize`         | `number`                                          | `10`                               | تعداد ردیف در صفحه |
| `pageSizeOptions`  | `number[]`                                        | `[5, 10, 20, 50]`                  | گزینه‌های انتخابگر |
| `initialPage`      | `number`                                          | `1`                                | صفحه اولیه         |
| `initialSort`      | `DataTableSort \| null`                           | `null`                             | مرتب‌سازی اولیه    |
| `pagination`       | `boolean`                                         | `true`                             | نمایش صفحه‌بندی    |
| `loading`          | `boolean`                                         | `false`                            | پوشش بارگذاری      |
| `emptyText`        | `string`                                          | `"داده‌ای برای نمایش وجود ندارد."` | متن خالی           |
| `loadingText`      | `string`                                          | `"در حال بارگذاری…"`               | متن بارگذاری       |
| `rowsPerPageLabel` | `string`                                          | `"تعداد در صفحه"`                  | برچسب انتخابگر     |
| `ariaLabel`        | `string`                                          | `"جدول داده"`                      | نام جدول           |
| `dir`              | `"rtl" \| "ltr"`                                  | `"rtl"`                            | جهت                |
| `striped`          | `boolean`                                         | `false`                            | ردیف‌های یک‌درمیان |
| `stickyHeader`     | `boolean`                                         | `false`                            | سرستون چسبان       |
| `rowKey`           | `keyof Row \| ((row, index) => string \| number)` | —                                  | کلید یکتا          |
| `class`            | `string`                                          | —                                  | کلاس ریشه          |
| `tableClass`       | `string`                                          | —                                  | کلاس جدول          |

### رویدادها

| رویداد            | نوع                     | توضیح            |
| ----------------- | ----------------------- | ---------------- |
| `update:page`     | `number`                | تغییر صفحه       |
| `update:pageSize` | `number`                | تغییر تعداد ردیف |
| `sort-change`     | `DataTableSort \| null` | تغییر مرتب‌سازی  |

### اسلات‌ها

برای هر ستون یک اسلات `cell-<key>` وجود دارد:

```vue
<template>
  <DataTable :data="rows" :columns="columns">
    <template #cell-status="{ value, row, index, column }">
      <span class="badge">{{ value }}</span>
    </template>
  </DataTable>
</template>
```

| پراپ اسلات | نوع                    | توضیح                 |
| ---------- | ---------------------- | --------------------- |
| `row`      | `Row`                  | ردیف جاری             |
| `value`    | `unknown`              | مقدار ستون            |
| `index`    | `number`               | اندیس ردیف در کل داده |
| `column`   | `DataTableColumn<Row>` | تعریف ستون            |

### Expose

| نام         | نوع                      | توضیح              |
| ----------- | ------------------------ | ------------------ |
| `page`      | `number`                 | صفحه فعلی          |
| `pageSize`  | `number`                 | تعداد ردیف در صفحه |
| `sort`      | `DataTableSort \| null`  | مرتب‌سازی فعلی     |
| `pageCount` | `number`                 | تعداد صفحه‌ها      |
| `setPage`   | `(page: number) => void` | رفتن به صفحه       |

## قالب‌بندی خودکار

اگر `format` ندهید:

- `Date` → تاریخ جلالی با الگوی `YYYY/MM/DD`
- `number` → `formatNumber` با رقم فارسی و جداکننده سه‌رقمی
- `boolean` → «بله» یا «خیر»
- `string` → رقم‌های لاتین به فارسی تبدیل می‌شوند
- `null`، `undefined` و رشته خالی → «—»

## مرتب‌سازی

مرتب‌سازی سمت کلاینت است:

- عددها عددی مقایسه می‌شوند.
- تاریخ‌ها بر اساس زمان مقایسه می‌شوند.
- رشته‌ها با `localeCompare('fa', { numeric: true })` مقایسه می‌شوند.
- کلیک اول صعودی، کلیک دوم نزولی و کلیک سوم مرتب‌سازی را حذف می‌کند.
- مقدارهای خالی در انتها قرار می‌گیرند.

برای داده‌های سنگین یا صفحه‌بندی سمت سرور، `pagination` را خاموش کنید و از رویدادهای
`update:page`، `update:pageSize` و `sort-change` برای واکشی داده استفاده کنید.

## دسترس‌پذیری

- سرستون‌های قابل مرتب‌سازی `aria-sort` می‌گیرند.
- دکمه مرتب‌سازی `aria-label` فارسی دارد.
- حالت بارگذاری با `aria-busy` و `role="status"` اعلام می‌شود.
- جدول `aria-label` دارد؛ برای هر جدول یک نام معنادار بدهید.
- صفحه‌بندی `aria-current="page"` و برچسب فارسی دارد.
