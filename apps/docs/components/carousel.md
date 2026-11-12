# چرخ‌وفلک

نمایش محتوای افقی قابل پیمایش با حرکت مرحله‌ای و پشتیبانی از RTL.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="carousel" />

## استفاده

```vue
<Carousel dir="rtl" :opts="{ direction: 'rtl', align: 'start', loop: true }">
  <CarouselContent>
    <CarouselItem class="basis-1/2">گزارش فروش</CarouselItem>
    <CarouselItem class="basis-1/2">گزارش فعالیت</CarouselItem>
  </CarouselContent>
  <CarouselPrevious aria-label="اسلاید قبلی">قبلی</CarouselPrevious>
  <CarouselNext aria-label="اسلاید بعدی">بعدی</CarouselNext>
</Carousel>
```

چرخ‌وفلک بر پایه Embla است؛ در RTL مقدار `dir` و گزینه `direction` را هم‌جهت تنظیم کنید. گزینه‌های Embla را از طریق `opts` و افزونه‌ها را از طریق `plugins` می‌توان فرستاد.
