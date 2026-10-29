<script setup lang="ts">
import { ref } from 'vue'
import { Input, Label } from '@saaze/ui'
import { formatNumber, parseNumber } from '@saaze/utils'

const name = ref('')
const phone = ref('')
const amount = ref('')
const email = ref('')

function amountHint(value: string) {
  const parsed = parseNumber(value)
  return Number.isFinite(parsed) && parsed > 0 ? formatNumber(parsed) : 'فقط رقم وارد کنید'
}
</script>

<template>
  <div class="grid w-full max-w-xl gap-6">
    <div class="grid gap-2">
      <Label for="demo-name">نام و نام خانوادگی</Label>
      <Input id="demo-name" v-model="name" placeholder="مثلاً سارا احمدی" />
    </div>

    <div class="grid gap-2">
      <Label for="demo-phone">شماره موبایل</Label>
      <Input
        id="demo-phone"
        v-model="phone"
        persian-digits
        inputmode="numeric"
        placeholder="۰۹۱۲ ۱۲۳ ۴۵۶۷"
      />
      <p class="text-xs text-muted-foreground">رقم‌های لاتین به‌صورت خودکار فارسی می‌شوند.</p>
    </div>

    <div class="grid gap-2">
      <Label for="demo-amount">مبلغ (تومان)</Label>
      <Input
        id="demo-amount"
        v-model="amount"
        persian-digits
        inputmode="numeric"
        placeholder="۲٬۵۰۰٬۰۰۰"
      />
      <p class="text-xs text-muted-foreground">{{ amountHint(amount) }}</p>
    </div>

    <div class="grid gap-2">
      <Label for="demo-email">ایمیل سازمانی</Label>
      <Input
        id="demo-email"
        v-model="email"
        type="email"
        dir="ltr"
        class="text-left"
        placeholder="name@company.ir"
      />
    </div>

    <div class="grid gap-2">
      <Label for="demo-disabled">کد ملی (غیرفعال)</Label>
      <Input id="demo-disabled" model-value="۰۰۱۲۳۴۵۶۷۸" disabled />
    </div>
  </div>
</template>
