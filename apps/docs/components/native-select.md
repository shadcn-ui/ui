# انتخاب‌گر بومی

انتخاب‌گر HTML بومی برای رفتار مرورگر و تجربه مناسب‌تر در دستگاه‌های همراه.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="native-select" />

## استفاده

```vue
<NativeSelect aria-label="انتخاب دوره">
  <NativeSelectOption value="">انتخاب دوره</NativeSelectOption>
  <NativeSelectOption value="month">این ماه</NativeSelectOption>
  <NativeSelectOption value="year">امسال</NativeSelectOption>
</NativeSelect>
```

برای گروه‌بندی گزینه‌ها از `NativeSelectOptGroup` استفاده کنید؛ برای منوی سفارشی، `Select` مناسب‌تر است.
