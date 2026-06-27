<script setup lang="ts">
import { ref } from 'vue'

import {
  Field,
  FieldLabel,
} from '@/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ui/input-otp'

const dir = ref<'ltr' | 'rtl'>('rtl')
const verificationCode = ref('رمز التحقق')
</script>

<template>
  <Field class="mx-auto max-w-xs">
    <FieldLabel for="input-otp-rtl">{{ verificationCode }}</FieldLabel>
    <InputOTP
      id="input-otp-rtl"
      :maxlength="6"
      default-value="123456"
      :dir="dir"
    >
      <InputOTPGroup>
        <InputOTPSlot :index="0" />
        <InputOTPSlot :index="1" />
        <InputOTPSlot :index="2" />
        <InputOTPSlot :index="3" />
        <InputOTPSlot :index="4" />
        <InputOTPSlot :index="5" />
      </InputOTPGroup>
    </InputOTP>
  </Field>
</template>
