# پالت فرمان

فهرستی جستجوپذیر برای فرمان‌های سریع، میان‌برهای صفحه‌کلید و ناوبری.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="پالت فرمان و لایه‌های رویی" description="دکمه جستجوی سریع را برای بازکردن پالت فرمان انتخاب کنید." />

## استفاده

```vue
<CommandDialog v-model:open="open">
  <CommandInput placeholder="جستجوی فرمان…" />
  <CommandList>
    <CommandEmpty>فرمانی پیدا نشد.</CommandEmpty>
    <CommandGroup heading="پیشنهادها">
      <CommandItem value="settings">تنظیمات</CommandItem>
      <CommandItem value="profile">پروفایل</CommandItem>
    </CommandGroup>
  </CommandList>
</CommandDialog>
```
