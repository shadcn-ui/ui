# گروه دکمه

چیدمان دکمه‌ها و متن‌های مرتبط به‌صورت یک گروه دارای برچسب دسترس‌پذیر.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="button-group" />

## استفاده

```vue
<ButtonGroup aria-label="اقدام‌های سند">
  <Button variant="outline">ذخیره</Button>
  <ButtonGroupSeparator />
  <Button variant="outline">اشتراک‌گذاری</Button>
  <ButtonGroupText>⌘K</ButtonGroupText>
</ButtonGroup>
```
