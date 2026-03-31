<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.TriggerProps = $props()
</script>

<MenubarPrimitive.Trigger
  bind:ref
  data-slot="menubar-trigger"
  class={cn(
    "cn-menubar-trigger flex items-center outline-hidden select-none",
    className
  )}
  {...restProps}
/>
