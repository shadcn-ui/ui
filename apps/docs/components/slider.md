# لغزنده

ورودی قابل‌دسترس برای انتخاب مقدار یا محدوده عددی.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کنترل‌های فرم" description="مقدار لغزنده را تغییر دهید تا درصد انتخاب‌شده به‌روزرسانی شود." />

## استفاده

```vue
<Slider v-model="volume" :min="0" :max="100" :step="1" />
```

مدل مقدار آرایه‌ای از اعداد است؛ برای لغزنده تک‌مقداری نیز مقدار اول آرایه استفاده می‌شود.
