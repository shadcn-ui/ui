<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMutationObserver } from '@vueuse/core'
import { Toaster as VueSonner, type ToasterProps } from 'vue-sonner'
import 'vue-sonner/style.css'
import { useSaazeDirection } from '@/lib/rtl'

/**
 * اعلان‌های Sonner با پیش‌فرض‌های فارسی: جهت از ارائه‌دهنده سازه خوانده می‌شود و
 * جایگاه پیش‌فرض گوشه پایین سمت پایان (چپ در RTL) است.
 */
const props = withDefaults(defineProps<ToasterProps>(), {
  position: undefined,
  theme: undefined,
  dir: undefined,
  containerAriaLabel: 'اعلان‌ها',
})

const direction = useSaazeDirection()
const resolvedDir = computed(() => props.dir ?? direction.value)
// تم سازه با کلاس `.dark` روی html تعیین می‌شود؛ Sonner را با همان هماهنگ می‌کنیم.
const isDark = ref(
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
)
useMutationObserver(
  typeof document !== 'undefined' ? document.documentElement : undefined,
  () => {
    isDark.value = document.documentElement.classList.contains('dark')
  },
  { attributes: true, attributeFilter: ['class'] },
)
const resolvedTheme = computed(() => props.theme ?? (isDark.value ? 'dark' : 'light'))

const resolvedPosition = computed(
  () => props.position ?? (resolvedDir.value === 'rtl' ? 'bottom-left' : 'bottom-right'),
)
</script>

<template>
  <VueSonner
    v-bind="props"
    :dir="resolvedDir"
    :position="resolvedPosition"
    :theme="resolvedTheme"
    class="toaster group"
    :style="{
      '--normal-bg': 'hsl(var(--popover))',
      '--normal-text': 'hsl(var(--popover-foreground))',
      '--normal-border': 'hsl(var(--border))',
      '--border-radius': 'var(--radius)',
      fontFamily: 'inherit',
      ...(props.style ?? {}),
    }"
    :toast-options="{
      ...props.toastOptions,
      classes: {
        toast:
          'group toast font-sans group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
        description: 'group-[.toast]:text-muted-foreground',
        actionButton: 'group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground',
        cancelButton: 'group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground',
        ...props.toastOptions?.classes,
      },
    }"
  />
</template>
