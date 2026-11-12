<script setup lang="ts">
import { ref } from 'vue'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@saaze/ui'

const code = ref<string[]>([])
</script>

<template>
  <div class="grid justify-items-center gap-3">
    <InputOTP v-model="code" aria-label="کد تأیید">
      <InputOTPGroup>
        <InputOTPSlot v-for="index in 3" :key="index" :index="index - 1" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot v-for="index in 3" :key="index + 3" :index="index + 2" />
      </InputOTPGroup>
    </InputOTP>
    <p class="text-xs text-muted-foreground" aria-live="polite">
      کد واردشده: {{ code.join('') || '—' }}
    </p>
  </div>
</template>
