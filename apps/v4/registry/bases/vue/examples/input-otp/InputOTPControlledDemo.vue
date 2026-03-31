<script setup lang="ts">
import { ref } from 'vue'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ui/input-otp'

const value = ref('')
</script>

<template>
  <div class="space-y-2">
    <InputOTP
      v-model="value"
      :maxlength="6"
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
    <div class="text-center text-sm">
      <template v-if="value === ''">
        Enter your one-time password.
      </template>
      <template v-else>
        You entered: {{ value }}
      </template>
    </div>
  </div>
</template>
