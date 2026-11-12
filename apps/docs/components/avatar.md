# آواتار

تصویر کاربر را نمایش می‌دهد و در صورت بارگذاری‌نشدن تصویر، جایگزین متنی نشان می‌دهد.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="display" title="کارت، نشان، هشدار و آواتار" description="تصویر و جایگزین فارسی آواتار را در ترکیب با اطلاعات کارت ببینید." />

## استفاده

```vue
<Avatar>
  <AvatarImage src="/users/sara.jpg" alt="سارا احمدی" />
  <AvatarFallback>س</AvatarFallback>
</Avatar>
```
