# گروه ورودی

ترکیب ورودی یا ناحیه متن با آیکن، دکمه یا متن راهنما.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="input-group" />

## استفاده

```vue
<InputGroup>
  <InputGroupInput placeholder="جستجوی مستندات..." aria-label="جستجو" />
  <InputGroupAddon><Search aria-hidden="true" /></InputGroupAddon>
</InputGroup>
```
