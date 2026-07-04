<script setup lang="ts">
import { reactiveOmit } from "@vueuse/core"
import { useForwardPropsEmits } from "reka-ui"
import type { HTMLAttributes } from "vue"
import { computed, provide } from "vue"
import type { OTPInputEmits, OTPInputProps } from "vue-input-otp"
import { OTPInput } from "vue-input-otp"

import { cn } from "@/lib/utils"

import { INPUT_OTP_DISABLED_KEY } from "./disabled-context"

const props = defineProps<OTPInputProps & { class?: HTMLAttributes["class"] }>()

const emits = defineEmits<OTPInputEmits>()

const delegatedProps = reactiveOmit(props, "class")

const forwarded = useForwardPropsEmits(delegatedProps, emits)

// [FORCE-UI] vue-input-otp's slot context has no disabled field — forward it
// ourselves so InputOTPSlot can apply the disabled-fill CSS
provide(
  INPUT_OTP_DISABLED_KEY,
  computed(() => !!props.disabled)
)
</script>

<template>
  <OTPInput
    v-slot="slotProps"
    v-bind="forwarded"
    :container-class="
      cn('cn-input-otp flex items-center has-disabled:opacity-50', props.class)
    "
    data-slot="input-otp"
    class="disabled:cursor-not-allowed"
  >
    <slot v-bind="slotProps" />
  </OTPInput>
</template>
