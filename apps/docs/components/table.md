# جدول

اجزای جدول برای ساخت جدول‌های معنایی و سفارشی مناسب‌اند. برای مرتب‌سازی، صفحه‌بندی و
قالب‌بندی خودکار داده‌های فارسی و جلالی، از [جدول داده](/components/data-table) استفاده کنید.

<script setup>
import TableDemo from '../demos/TableDemo.vue'
import tableDemoCode from '../demos/TableDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="اعضای تیم" description="جدول معنایی با سرستون، ردیف‌ها و کپشن." :code="tableDemoCode">

  <TableDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@saaze/ui'
</script>

<template>
  <Table>
    <TableCaption>فهرست اعضای تیم</TableCaption>
    <TableHeader>
      <TableRow>
        <TableHead>نام</TableHead>
        <TableHead>وضعیت</TableHead>
        <TableHead class="text-end">نقش</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>سارا احمدی</TableCell>
        <TableCell>فعال</TableCell>
        <TableCell class="text-end">مدیر</TableCell>
      </TableRow>
    </TableBody>
  </Table>
</template>
```

## اجزا

`Table` جدول را در ظرفی با پیمایش افقی قرار می‌دهد. اجزای `TableHeader`، `TableBody`،
`TableFooter`، `TableRow`، `TableHead`، `TableCell` و `TableCaption` به‌ترتیب معادل
ساختارهای معنایی جدول هستند و هرکدام ویژگی `class` می‌پذیرند.

برای هم‌ترازی سازگار با RTL از کلاس‌های منطقی مانند `text-start` و `text-end` استفاده کنید.
برای داده‌های تعاملی از جمله مرتب‌سازی و صفحه‌بندی، مستندات `DataTable` را ببینید.
