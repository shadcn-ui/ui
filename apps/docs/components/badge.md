# نشان

برچسب فشرده برای وضعیت، دسته‌بندی یا شمارنده.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="display" title="نشان‌ها و وضعیت‌ها" description="گونه‌های موفقیت، هشدار، خطا و حالت خنثی را ببینید." />

## استفاده

```vue
<div class="flex flex-wrap gap-2">
  <Badge>جدید</Badge>
  <Badge variant="success">فعال</Badge>
  <Badge variant="destructive">ناموفق</Badge>
  <Badge variant="outline">پیش‌نویس</Badge>
</div>
```
