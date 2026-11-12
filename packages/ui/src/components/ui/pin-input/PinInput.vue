<script setup lang="ts">
import type { PinInputRootEmits, PinInputRootProps } from 'radix-vue'
import type { HTMLAttributes } from 'vue'
import { reactiveOmit } from '@vueuse/core'
import { PinInputRoot, useForwardPropsEmits } from 'radix-vue'
import { cn } from '@/lib/utils'

/**
 * ورودی پین عمومی (هم‌نام shadcn-vue). برخلاف `InputOTP`، تکمیل خودکار پیامک را
 * به‌طور پیش‌فرض روشن نمی‌کند. جهت پیش‌فرض LTR است تا رقم‌ها به ترتیب خوانده شوند.
 */
const props = withDefaults(defineProps<PinInputRootProps & { class?: HTMLAttributes['class'] }>(), {
  dir: 'ltr',
})
const emits = defineEmits<PinInputRootEmits>()

const delegatedProps = reactiveOmit(props, 'class')
const forwarded = useForwardPropsEmits(delegatedProps, emits)
</script>

<template>
  <PinInputRoot v-bind="forwarded" :class="cn('flex items-center gap-2', props.class)">
    <slot />
  </PinInputRoot>
</template>
