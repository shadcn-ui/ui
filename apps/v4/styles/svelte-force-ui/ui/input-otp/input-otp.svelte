<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { PinInput as InputOTPPrimitive } from "bits-ui"
  import { setContext } from "svelte"

  import { INPUT_OTP_DISABLED_KEY } from "./disabled-context.js"

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    disabled,
    ...restProps
  }: InputOTPPrimitive.RootProps = $props()

  // [FORCE-UI] bits-ui's PinInput.Cell has no disabled field — forward it
  // ourselves so input-otp-slot can apply the disabled-fill CSS
  setContext(INPUT_OTP_DISABLED_KEY, () => !!disabled)
</script>

<InputOTPPrimitive.Root
  bind:ref
  bind:value
  {disabled}
  data-slot="input-otp"
  spellcheck={false}
  class={cn(
    "cn-input-otp-input cn-input-otp flex items-center disabled:cursor-not-allowed has-disabled:opacity-50",
    className
  )}
  {...restProps}
/>
