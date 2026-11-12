# اسکلت

حالت بارگذاری نمایشی که ابعاد و ساختار تقریبی محتوای آینده را حفظ می‌کند.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="status" title="وضعیت، پیشرفت و اسکلت" description="اسکلت آواتار و خطوط متن نمونه را ببینید." />

## استفاده

```vue
<div class="flex items-center gap-3" aria-label="در حال بارگذاری">
  <Skeleton class="size-10 rounded-full" />
  <div class="grid flex-1 gap-2">
    <Skeleton class="h-4 w-2/3" />
    <Skeleton class="h-4 w-1/2" />
  </div>
</div>
```
