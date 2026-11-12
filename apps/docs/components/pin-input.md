# ورودی پین

ورودی چندخانه‌ای برای رمز یا کد عددی، هم‌نام با Pin Input در shadcn-vue. برخلاف [ورودی یک‌بارمصرف](/components/input-otp)، تکمیل خودکار پیامک (`otp`) به‌طور پیش‌فرض خاموش است.

<script setup>
import PinInputDemo from '../demos/PinInputDemo.vue'
import demoCode from '../demos/PinInputDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="رمز چهاررقمی" description="رقم‌ها را وارد کنید؛ رویداد complete پس از پرشدن همه خانه‌ها اجرا می‌شود." :code="demoCode">

  <PinInputDemo />
</DemoBlock>

## استفاده

```vue
<PinInput v-model="pin" type="number" placeholder="○">
  <PinInputGroup>
    <PinInputSlot v-for="index in 4" :key="index" :index="index - 1" />
  </PinInputGroup>
</PinInput>
```

## اجزا

`PinInput` ریشه است (`modelValue`، `type`، `mask`، `otp`، `placeholder`، `disabled`). `PinInputGroup`، `PinInputSlot` (یا نام معادل `PinInputInput`) و `PinInputSeparator` همان اجزای ورودی یک‌بارمصرف هستند. جهت پیش‌فرض LTR است تا ترتیب رقم‌ها با خواندن کد یکی باشد.
