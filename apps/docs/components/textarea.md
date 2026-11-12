# ناحیه متن

ورودی چندخطی فارسی با تبدیل رقم‌ها و حفظ رفتار بومی `textarea`.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کنترل‌های فرم" description="ناحیه متن فارسی را با ورودی‌های انتخابی مقایسه کنید." />

## استفاده

```vue
<Textarea v-model="description" persian-digits rows="4" placeholder="توضیحات خود را بنویسید…" />
```
