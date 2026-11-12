# گروه کلیدها

مجموعه‌ای از کلیدهای مرتبط با انتخاب تکی یا چندگانه.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="گروه کلیدها و کنترل‌های فرم" description="قالب‌بندی درشت، کج یا زیرخط را انتخاب کنید." />

## استفاده

```vue
<ToggleGroup v-model="format" type="single" aria-label="قالب متن">
  <ToggleGroupItem value="bold" aria-label="درشت"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="کج"><Italic /></ToggleGroupItem>
</ToggleGroup>
```
