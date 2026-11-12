# هشدار

پیام‌های درون‌صفحه‌ای برای اطلاع‌رسانی، موفقیت، هشدار و خطا.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="display" title="هشدارها" description="حالت‌های پیش‌فرض، موفقیت و خطا را در کنار کارت و نشان ببینید." />

## استفاده

```vue
<Alert variant="destructive">
  <AlertTitle>ذخیره انجام نشد</AlertTitle>
  <AlertDescription>اتصال شبکه را بررسی کنید و دوباره تلاش کنید.</AlertDescription>
</Alert>
```

`variant` از حالت‌های `default`، `success`، `warning` و `destructive` پشتیبانی می‌کند.
