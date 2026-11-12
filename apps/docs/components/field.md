# فیلد

ساختار دسترس‌پذیر برای کنترل فرم، برچسب، توضیح و پیام خطا.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="field" />

## استفاده

```vue
<FieldSet>
  <FieldLegend>مشخصات حساب</FieldLegend>
  <Field>
    <FieldLabel for="email">رایانامه</FieldLabel>
    <Input id="email" type="email" />
    <FieldDescription>برای دریافت رسیدها استفاده می‌شود.</FieldDescription>
    <FieldError>رایانامه معتبر نیست.</FieldError>
  </Field>
</FieldSet>
```

برای چیدمان چند فیلد از `FieldGroup` و برای گروه‌بندی معنایی از `FieldSet` و `FieldLegend` استفاده کنید.
