<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { RadioGroup as RadioGroupPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    value = $bindable(""),
    ...restProps
  }: RadioGroupPrimitive.RootProps = $props()
</script>

<RadioGroupPrimitive.Root
  bind:ref
  bind:value
  data-slot="radio-group"
  class={cn("cn-radio-group w-full", className)}
  {...restProps}
/>
