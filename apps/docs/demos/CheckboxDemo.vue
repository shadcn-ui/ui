<script setup lang="ts">
import { ref } from 'vue'
import { Checkbox, Label } from '@saaze/ui'

const accepted = ref(true)
const newsletter = ref(false)
</script>

<template>
  <div class="grid w-full max-w-md gap-5">
    <div class="flex items-start gap-3">
      <Checkbox id="terms" v-model:checked="accepted" class="mt-0.5" />
      <div class="grid gap-1">
        <Label for="terms">قوانین و مقررات را می‌پذیرم</Label>
        <p class="text-xs leading-6 text-muted-foreground">
          برای ادامه باید شرایط استفاده از سرویس را بپذیرید.
        </p>
      </div>
    </div>

    <div class="flex items-start gap-3">
      <Checkbox id="newsletter" v-model:checked="newsletter" class="mt-0.5" />
      <div class="grid gap-1">
        <Label for="newsletter">خبرنامه محصولات</Label>
        <p class="text-xs leading-6 text-muted-foreground">
          از تخفیف‌ها و قابلیت‌های تازه باخبر شوید.
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <Checkbox id="indeterminate" checked="indeterminate" />
      <Label for="indeterminate">انتخاب همه (نیمه‌انتخاب)</Label>
    </div>

    <div class="flex items-center gap-3">
      <Checkbox id="disabled" :checked="true" disabled />
      <Label for="disabled">گزینه غیرفعال</Label>
    </div>
  </div>
</template>
