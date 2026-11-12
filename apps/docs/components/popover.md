# پاپ‌اور

محتوای شناور برای فیلترها و فرم‌های کوچک، با جهت و ترازبندی منطقی.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="پاپ‌اور و لایه‌های رویی" description="پاپ‌اور فیلتر را باز کنید؛ جای‌گذاری آن با جهت صفحه هماهنگ است." />

## استفاده

```vue
<Popover>
  <PopoverTrigger as-child><Button variant="outline">فیلتر نتایج</Button></PopoverTrigger>
  <PopoverContent class="grid gap-3">
    <Label for="project-name">نام پروژه</Label>
    <Input id="project-name" placeholder="نام پروژه…" />
  </PopoverContent>
</Popover>
```
