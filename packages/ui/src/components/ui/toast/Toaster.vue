<script setup lang="ts">
import { computed, isVNode } from 'vue'
import { useSaazeDirection } from '@/lib/rtl'
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from '.'
import { useToast } from './use-toast'

const { toasts } = useToast()
const direction = useSaazeDirection()
const swipeDirection = computed(() => (direction.value === 'rtl' ? 'left' : 'right'))
</script>

<template>
  <ToastProvider label="اعلان" :duration="5000" :swipe-direction="swipeDirection">
    <Toast
      v-for="toast in toasts"
      :key="toast.id"
      :open="toast.open"
      :variant="toast.variant"
      :class="toast.class"
      :on-open-change="toast.onOpenChange"
    >
      <div class="grid gap-1">
        <ToastTitle v-if="toast.title">
          {{ toast.title }}
        </ToastTitle>
        <template v-if="toast.description">
          <ToastDescription v-if="isVNode(toast.description)">
            <component :is="toast.description" />
          </ToastDescription>
          <ToastDescription v-else>
            {{ toast.description }}
          </ToastDescription>
        </template>
        <ToastClose />
      </div>
      <component :is="toast.action" />
    </Toast>
    <ToastViewport label="اعلان‌ها" />
  </ToastProvider>
</template>
