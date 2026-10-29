<script setup lang="ts">
import { ref } from 'vue'
import { Label, Switch } from '@saaze/ui'

const notifications = ref(true)
const twoFactor = ref(false)
</script>

<template>
  <div class="grid w-full max-w-md gap-5">
    <div class="flex items-center justify-between gap-6 rounded-xl border p-4">
      <div class="grid gap-1">
        <Label for="switch-notifications">اعلان‌های ایمیلی</Label>
        <p class="text-xs leading-6 text-muted-foreground">
          خلاصه سفارش‌ها و تغییر وضعیت حساب ارسال شود.
        </p>
      </div>
      <Switch id="switch-notifications" v-model:checked="notifications" />
    </div>

    <div class="flex items-center justify-between gap-6 rounded-xl border p-4">
      <div class="grid gap-1">
        <Label for="switch-2fa">ورود دو مرحله‌ای</Label>
        <p class="text-xs leading-6 text-muted-foreground">امنیت بیشتر با کد یک‌بارمصرف.</p>
      </div>
      <Switch id="switch-2fa" v-model:checked="twoFactor" />
    </div>

    <div class="flex items-center justify-between gap-6 rounded-xl border p-4 opacity-60">
      <div class="grid gap-1">
        <Label for="switch-disabled">همگام‌سازی تقویم</Label>
        <p class="text-xs leading-6 text-muted-foreground">این گزینه در طرح فعلی فعال نیست.</p>
      </div>
      <Switch id="switch-disabled" :checked="false" disabled />
    </div>
  </div>
</template>
