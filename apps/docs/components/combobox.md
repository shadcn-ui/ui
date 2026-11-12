# انتخاب‌گر جستجوپذیر

فهرست انتخابی با جستجو و گروه‌بندی؛ مناسب گزینه‌های طولانی و جستجوی فارسی.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کنترل‌های فرم" description="انتخاب‌گر جستجوپذیر را در کنار Select و ورودی‌های دیگر آزمایش کنید." />

## استفاده

```vue
<Combobox
  v-model="framework"
  :options="[
    { value: 'vue', label: 'Vue', group: 'کتابخانه‌ها' },
    { value: 'nuxt', label: 'Nuxt', group: 'فریمورک‌ها' },
  ]"
  placeholder="جستجو و انتخاب کنید"
/>
```
