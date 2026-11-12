# محتوای تاشو

بخش مستقلی برای نمایش یا پنهان‌کردن محتوا با وضعیت قابل‌کنترل.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="layout" title="آکاردئون و محتوای تاشو" description="بخش تنظیمات پیشرفته را باز و بسته کنید." />

## استفاده

```vue
<Collapsible v-model:open="open">
  <CollapsibleTrigger as-child>
    <Button variant="outline">تنظیمات پیشرفته</Button>
  </CollapsibleTrigger>
  <CollapsibleContent>گزینه‌های بیشتر در این بخش قرار می‌گیرند.</CollapsibleContent>
</Collapsible>
```
