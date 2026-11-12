# گروه دکمه رادیویی

انتخاب یک گزینه از مجموعه‌ای از گزینه‌های مرتبط.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="forms" title="کنترل‌های فرم" description="بین پرداخت ماهانه و سالانه انتخاب کنید." />

## استفاده

```vue
<RadioGroup v-model="billingPeriod">
  <div class="flex items-center gap-2">
    <RadioGroupItem id="monthly-plan" value="monthly" />
    <Label for="monthly-plan">ماهانه</Label>
  </div>
  <div class="flex items-center gap-2">
    <RadioGroupItem id="yearly-plan" value="yearly" />
    <Label for="yearly-plan">سالانه</Label>
  </div>
</RadioGroup>
```
