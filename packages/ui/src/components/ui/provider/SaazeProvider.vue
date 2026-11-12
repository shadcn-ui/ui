<script setup lang="ts">
import { computed, provide } from 'vue'
import { ConfigProvider, type ConfigProviderProps, useForwardProps } from 'radix-vue'
import { saazeDirectionKey, type Direction } from '@/lib/rtl'

/**
 * تنظیمات سراسری سازه UI؛ جهت پیش‌فرض راست‌به‌چپ است.
 * بهتر است کل برنامه یا ناحیه فارسی را داخل این مؤلفه بگذارید. همه مؤلفه‌هایی که
 * `dir` صریح نگرفته‌اند جهت را از این ارائه‌دهنده می‌خوانند.
 */
const props = withDefaults(defineProps<ConfigProviderProps>(), {
  dir: 'rtl',
})
const forwarded = useForwardProps(props)

provide(
  saazeDirectionKey,
  computed(() => (props.dir ?? 'rtl') as Direction),
)
</script>

<template>
  <ConfigProvider v-bind="forwarded">
    <slot />
  </ConfigProvider>
</template>
