<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { ContextMenu as ContextMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ContextMenuPrimitive.SeparatorProps = $props()
</script>

<ContextMenuPrimitive.Separator
  bind:ref
  data-slot="context-menu-separator"
  class={cn("cn-context-menu-separator", className)}
  {...restProps}
/>
