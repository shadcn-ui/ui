<script setup lang="ts">
import { REGEXP_ONLY_DIGITS } from 'vue-input-otp'

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ui/input-otp'
</script>

<template>
  <InputOTP :maxlength="4" :pattern="REGEXP_ONLY_DIGITS">
    <InputOTPGroup>
      <InputOTPSlot :index="0" />
      <InputOTPSlot :index="1" />
      <InputOTPSlot :index="2" />
      <InputOTPSlot :index="3" />
    </InputOTPGroup>
  </InputOTP>
</template>
