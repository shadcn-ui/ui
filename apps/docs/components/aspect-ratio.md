# نسبت تصویر

محتوا را بدون تغییر نسبت ابعاد در اندازه‌های مختلف نگه می‌دارد.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="status" title="نمایش وضعیت و نسبت تصویر" description="نسبت ۱۶ به ۹ را همراه با Progress و Skeleton بررسی کنید." />

## استفاده

```vue
<AspectRatio :ratio="16 / 9" class="overflow-hidden rounded-md bg-muted">
  <img src="/cover.jpg" alt="تصویر جلد" class="size-full object-cover" />
</AspectRatio>
```
