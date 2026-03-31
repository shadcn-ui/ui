<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Menubar as MenubarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: MenubarPrimitive.SubContentProps = $props()
</script>

<MenubarPrimitive.SubContent
  bind:ref
  data-slot="menubar-sub-content"
  class={cn(
    "cn-menubar-sub-content cn-menu-target cn-menu-translucent",
    className
  )}
  {...restProps}
/>
