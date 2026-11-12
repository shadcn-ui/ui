# راهنمای شناور

توضیح کوتاه را هنگام فوکوس یا مکث روی یک عنصر نمایش می‌دهد.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="راهنمای شناور و لایه‌های رویی" description="روی دکمه تنظیمات مکث کنید یا با صفحه‌کلید آن را فوکوس کنید." />

## استفاده

```vue
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="outline" size="icon" aria-label="تنظیمات"><Settings /></Button>
    </TooltipTrigger>
    <TooltipContent>تنظیمات حساب</TooltipContent>
  </Tooltip>
</TooltipProvider>
```
