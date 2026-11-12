# پیشرفت

نوار نمایش میزان تکمیل یک فرایند با مقدار بین صفر تا صد.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="status" title="وضعیت، پیشرفت و نسبت تصویر" description="نوار پیشرفت نمونه مقدار ۶۲ درصد را نشان می‌دهد." />

## استفاده

```vue
<Progress :model-value="progress" aria-label="پیشرفت بارگذاری" />
```

مقدار `modelValue` عددی بین `0` و `100` است.
