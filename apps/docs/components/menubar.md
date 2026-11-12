# نوار منو

منوی افقی با رفتار صفحه‌کلید برای مجموعه‌ای از فرمان‌های مرتبط.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="منوها و لایه‌های رویی" description="منوی فایل یا ویرایش را باز کنید و با صفحه‌کلید جابه‌جا شوید." />

## استفاده

```vue
<Menubar>
  <MenubarMenu>
    <MenubarTrigger>فایل</MenubarTrigger>
    <MenubarContent>
      <MenubarItem>سند جدید</MenubarItem>
      <MenubarSeparator />
      <MenubarItem>خروج</MenubarItem>
    </MenubarContent>
  </MenubarMenu>
</Menubar>
```
