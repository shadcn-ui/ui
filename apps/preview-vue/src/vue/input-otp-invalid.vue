<script setup lang="ts">
import { ref } from 'vue'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/ui/input-otp'

const value = ref('000000')
</script>

<template>
  <InputOTP v-model="value" :maxlength="6">
    <InputOTPGroup>
      <InputOTPSlot :index="0" aria-invalid="true" />
      <InputOTPSlot :index="1" aria-invalid="true" />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot :index="2" aria-invalid="true" />
      <InputOTPSlot :index="3" aria-invalid="true" />
    </InputOTPGroup>
    <InputOTPSeparator />
    <InputOTPGroup>
      <InputOTPSlot :index="4" aria-invalid="true" />
      <InputOTPSlot :index="5" aria-invalid="true" />
    </InputOTPGroup>
  </InputOTP>
</template>
