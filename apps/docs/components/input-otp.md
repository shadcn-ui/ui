# ورودی یک‌بارمصرف

ورودی یک‌بارمصرف (OTP) از primitive دسترس‌پذیر Pin Input در Radix Vue استفاده می‌کند.
مقدار مدل به شکل آرایه‌ای از رشته‌ها است؛ برای فعال‌کردن تکمیل خودکار پیامک، `otp` را روشن
نگه دارید (پیش‌فرض).

<script setup>
import InputOTPDemo from '../demos/InputOTPDemo.vue'
import inputOtpDemoCode from '../demos/InputOTPDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="کد تأیید شش‌رقمی" description="کد را وارد کنید؛ فوکوس و حرکت میان خانه‌ها با صفحه‌کلید مدیریت می‌شود." :code="inputOtpDemoCode">

  <InputOTPDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from '@saaze/ui'

const code = ref<string[]>([])
</script>

<template>
  <InputOTP v-model="code" aria-label="کد تأیید">
    <InputOTPGroup>
      <InputOTPSlot v-for="index in 3" :key="index" :index="index - 1" />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot v-for="index in 3" :key="index + 3" :index="index + 2" />
    </InputOTPGroup>
  </InputOTP>
</template>
```

## اجزا

`InputOTP` ویژگی‌های ریشه Pin Input از جمله `modelValue`، `disabled`، `required`،
`mask`، `placeholder`، `type` و `dir` را می‌پذیرد. از `v-model` برای کنترل مقدار و رویداد
`complete` برای دریافت کد کامل استفاده کنید.

`InputOTPGroup` خانه‌ها را گروه‌بندی می‌کند، `InputOTPSlot` هر خانه را با ویژگی الزامی
`index` مشخص می‌کند و `InputOTPSeparator` جداکننده اختیاری میان گروه‌هاست. جهت پیش‌فرض
LTR است تا رقم‌های کد از چپ به راست وارد شوند؛ برای ترتیب RTL، `dir="rtl"` بدهید.
