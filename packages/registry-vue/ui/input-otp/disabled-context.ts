import type { ComputedRef, InjectionKey } from "vue"

// [FORCE-UI] shared provide/inject key linking InputOTP's disabled prop to
// InputOTPSlot, since vue-input-otp's own slot context doesn't expose it
export const INPUT_OTP_DISABLED_KEY: InjectionKey<ComputedRef<boolean>> =
  Symbol("input-otp-disabled")
