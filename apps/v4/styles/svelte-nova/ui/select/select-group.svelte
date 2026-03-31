<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Select as SelectPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: SelectPrimitive.GroupProps = $props()
</script>

<SelectPrimitive.Group
  bind:ref
  data-slot="select-group"
  class={cn("cn-select-group", className)}
  {...restProps}
/>
