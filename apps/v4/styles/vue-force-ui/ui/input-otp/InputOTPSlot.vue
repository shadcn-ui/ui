<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import { useForwardProps } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, inject } from "vue"
import { useVueOTPContext } from "vue-input-otp"

import { cn } from "@/lib/utils"

import { INPUT_OTP_DISABLED_KEY } from "./disabled-context"

const props = defineProps<{ index: number; class?: HTMLAttributes["class"] }>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardProps(delegatedProps)

const context = useVueOTPContext()

const slot = computed(() => context?.value.slots[props.index])
const disabled = inject(
  INPUT_OTP_DISABLED_KEY,
  computed(() => false)
)
</script>

<template>
  <div
    v-bind="forwarded"
    data-slot="input-otp-slot"
    :data-active="slot?.isActive"
    :data-disabled="disabled"
    :class="
      cn(
        'cn-input-otp-slot relative flex h-9 w-9 items-center justify-center text-sm outline-none first:rounded-l-md last:rounded-r-md',
        props.class
      )
    "
  >
    {{ slot?.char }}
    <div
      v-if="slot?.hasFakeCaret"
      class="cn-input-otp-caret pointer-events-none absolute inset-0 flex items-center justify-center"
    >
      <div class="cn-input-otp-caret-line" />
    </div>
  </div>
</template>
