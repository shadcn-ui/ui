// [FORCE-UI] shared Svelte context key linking input-otp's disabled prop to
// input-otp-slot, since bits-ui's PinInput.Cell doesn't expose it
export const INPUT_OTP_DISABLED_KEY = Symbol("input-otp-disabled")
