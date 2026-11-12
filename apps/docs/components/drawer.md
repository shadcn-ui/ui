# کشوی پایین‌رو

پنل کشویی موقت که از لبه پایین باز می‌شود و در موبایل برای اقدام‌های زمینه‌ای کاربرد دارد.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="drawer" />

## استفاده

```vue
<Drawer>
  <DrawerTrigger as-child><Button>نمایش جزئیات</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>تنظیمات حساب</DrawerTitle>
      <DrawerDescription>جزئیات حساب خود را بررسی کنید.</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>
```

`DrawerContent` از سمت پایین ظاهر می‌شود؛ برای پنل‌های کناری با جهت منطقی از `Sheet` استفاده کنید.
