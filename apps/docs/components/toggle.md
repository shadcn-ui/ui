# کلید تغییر وضعیت

دکمه‌ای با وضعیت فشرده‌شده برای روشن/خاموش‌کردن یک حالت.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کلیدها و کنترل‌های فرم" description="کلید تأکید متن را فعال یا غیرفعال کنید." />

## استفاده

```vue
<Toggle v-model:pressed="bold" aria-label="تأکید متن">
  <Bold aria-hidden="true" />
</Toggle>
```
