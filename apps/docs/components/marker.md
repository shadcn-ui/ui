# نشانگر

نشانگر درون‌خطی برای وضعیت‌ها، یادداشت‌های سیستمی و جداکننده‌های گفتگو.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="marker" />

## استفاده

```vue
<Marker variant="border" role="status">
  <MarkerIcon><Check aria-hidden="true" /></MarkerIcon>
  <MarkerContent>سه فایل با موفقیت بررسی شدند.</MarkerContent>
</Marker>
```

گونه‌های `default`، `border` و `separator` برای حالت‌های مختلف در دسترس هستند.
