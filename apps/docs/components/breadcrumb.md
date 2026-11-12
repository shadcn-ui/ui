# مسیر راهنما

مسیر راهنما جایگاه صفحه جاری را در ساختار سایت نشان می‌دهد. اجزای آن از نشانه‌گذاری معنایی
استفاده می‌کنند و جداکننده پیش‌فرض در جهت RTL به سمت چپ نمایش داده می‌شود.

<script setup>
import BreadcrumbDemo from '../demos/BreadcrumbDemo.vue'
import breadcrumbDemoCode from '../demos/BreadcrumbDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="مسیر صفحه" description="نمونه‌ای از پیوندها، جداکننده و کوتاه‌سازی مسیر." :code="breadcrumbDemoCode">

  <BreadcrumbDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@saaze/ui'
</script>

<template>
  <Breadcrumb aria-label="مسیر صفحه">
    <BreadcrumbList>
      <BreadcrumbItem><BreadcrumbLink href="/">خانه</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbLink href="/products">محصولات</BreadcrumbLink></BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem><BreadcrumbPage>جزئیات</BreadcrumbPage></BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
```

## اجزا

| جزء | کاربرد |
| --- | --- |
| `Breadcrumb` | ظرف ناوبری با برچسب دسترس‌پذیر |
| `BreadcrumbList` | فهرست ترتیبی مسیر |
| `BreadcrumbItem` | هر مرحله از مسیر |
| `BreadcrumbLink` | پیوند قابل پیمایش؛ ویژگی‌های لینک مانند `href` را می‌پذیرد |
| `BreadcrumbPage` | صفحه جاری با `aria-current="page"` |
| `BreadcrumbSeparator` | جداکننده سفارشی یا پیش‌فرض |
| `BreadcrumbEllipsis` | نمایش کوتاه‌شده مراحل پنهان |

همه اجزا ویژگی `class` را برای افزودن یا جایگزینی کلاس‌ها می‌پذیرند. برای دسترس‌پذیری،
صفحه جاری را با `BreadcrumbPage` مشخص و برای ناوبری نامی معنادار تعیین کنید.
