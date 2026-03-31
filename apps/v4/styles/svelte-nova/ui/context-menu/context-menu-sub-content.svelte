<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { ContextMenu as ContextMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ContextMenuPrimitive.SubContentProps = $props()
</script>

<ContextMenuPrimitive.SubContent
  bind:ref
  data-slot="context-menu-sub-content"
  class={cn(
    "cn-context-menu-sub-content cn-menu-target cn-menu-translucent",
    className
  )}
  {...restProps}
/>
