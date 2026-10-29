<script setup lang="ts">
import { ConfigProvider, type ConfigProviderProps, useForwardProps } from 'radix-vue'

/**
 * تنظیمات سراسری سازه UI؛ جهت پیش‌فرض راست‌به‌چپ است.
 * بهتر است کل برنامه یا ناحیه فارسی را داخل این مؤلفه بگذارید.
 */
const props = withDefaults(defineProps<ConfigProviderProps>(), {
  dir: 'rtl',
})
const forwarded = useForwardProps(props)
</script>

<template>
  <ConfigProvider v-bind="forwarded">
    <slot />
  </ConfigProvider>
</template>
