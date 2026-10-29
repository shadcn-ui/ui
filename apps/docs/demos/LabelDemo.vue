<script setup lang="ts">
import { ref } from 'vue'
import { Input, Label } from '@saaze/ui'

const email = ref('sara@saaze.ir')
</script>

<template>
  <div class="grid w-full max-w-sm gap-6">
    <div class="grid gap-2">
      <Label for="label-email">ایمیل</Label>
      <Input id="label-email" v-model="email" type="email" dir="ltr" class="text-left" />
      <p class="text-xs text-muted-foreground">
        برای اتصال برچسب به ورودی، از <code>for</code> استفاده کنید.
      </p>
    </div>

    <div class="grid gap-2">
      <Label for="label-disabled">شناسه کاربری</Label>
      <Input id="label-disabled" model-value="saaze-1404" disabled />
      <p class="text-xs text-muted-foreground">برچسب ورودی غیرفعال نیز کم‌رنگ می‌شود.</p>
    </div>
  </div>
</template>
