# کشو

پنل کشویی برای نمایش تنظیمات یا محتوای تکمیلی؛ `side="start"` و `side="end"` در RTL منطقی‌اند.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="کشو و لایه‌های رویی" description="کشو از لبه انتهایی منطقی باز می‌شود؛ در RTL از سمت چپ." />

## استفاده

```vue
<Sheet>
  <SheetTrigger as-child><Button variant="outline">تنظیمات</Button></SheetTrigger>
  <SheetContent side="end">
    <SheetHeader>
      <SheetTitle>تنظیمات حساب</SheetTitle>
      <SheetDescription>اطلاعات نمایشی خود را ویرایش کنید.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>
```
