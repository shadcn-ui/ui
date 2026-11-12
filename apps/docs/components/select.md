# انتخاب‌گر

انتخاب یک مقدار از فهرست بازشونده با مدیریت فوکوس و صفحه‌کلید Radix Vue.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کنترل‌های فرم" description="فهرست نوع اشتراک را باز کنید و یک گزینه انتخاب کنید." />

## استفاده

```vue
<Select v-model="plan">
  <SelectTrigger class="w-full">
    <SelectValue placeholder="نوع اشتراک" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="basic">پایه</SelectItem>
    <SelectItem value="pro">حرفه‌ای</SelectItem>
  </SelectContent>
</Select>
```
