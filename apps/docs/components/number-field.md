# فیلد عددی

ورودی عددی با دکمه‌های افزایش و کاهش، بر پایه NumberField در Radix Vue. پیش‌فرض `locale` روی `fa-IR` است؛ پس عدد با رقم فارسی و جداکننده هزارگان فارسی نمایش داده می‌شود و رقم‌های فارسی، عربی و لاتین هنگام تایپ پذیرفته می‌شوند.

<script setup>
import NumberFieldDemo from '../demos/NumberFieldDemo.vue'
import demoCode from '../demos/NumberFieldDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="تعداد و مبلغ" description="با کلیدهای بالا/پایین یا دکمه‌ها مقدار را تغییر دهید." :code="demoCode">

  <NumberFieldDemo />
</DemoBlock>

## استفاده

```vue
<NumberField v-model="quantity" :min="1" :max="20">
  <Label>تعداد</Label>
  <NumberFieldContent>
    <NumberFieldDecrement />
    <NumberFieldInput />
    <NumberFieldIncrement />
  </NumberFieldContent>
</NumberField>
```

## اجزا

`NumberField` همه ویژگی‌های ریشه Radix از جمله `min`، `max`، `step`، `formatOptions`، `locale` و `disabled` را می‌پذیرد. دکمه کاهش در لبه `start` و دکمه افزایش در لبه `end` قرار می‌گیرد و در RTL خودکار آینه می‌شود.
