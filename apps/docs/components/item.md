# آیتم

ردیف محتوایی برای نمایش رسانه، عنوان، توضیح و اقدام‌ها.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="item" />

## استفاده

```vue
<Item variant="outline">
  <ItemMedia><FileText /></ItemMedia>
  <ItemContent>
    <ItemTitle>گزارش سه‌ماهه</ItemTitle>
    <ItemDescription>آخرین ویرایش: امروز</ItemDescription>
  </ItemContent>
  <ItemActions><Button size="sm">بازکردن</Button></ItemActions>
</Item>
```

برای ساخت فهرست، چند `Item` را داخل `ItemGroup` قرار دهید.
