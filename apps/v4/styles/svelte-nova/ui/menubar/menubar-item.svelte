<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    inset = undefined,
    variant = "default",
    ...restProps
  }: MenubarPrimitive.ItemProps & {
    inset?: boolean
    variant?: "default" | "destructive"
  } = $props()
</script>

<MenubarPrimitive.Item
  bind:ref
  data-slot="menubar-item"
  data-inset={inset}
  data-variant={variant}
  class={cn("cn-menubar-item group/menubar-item flex items-center", className)}
  {...restProps}
/>
