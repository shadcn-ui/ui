<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { ContextMenu as ContextMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: ContextMenuPrimitive.TriggerProps = $props()
</script>

<ContextMenuPrimitive.Trigger
  bind:ref
  data-slot="context-menu-trigger"
  class={cn("cn-context-menu-trigger select-none", className)}
  {...restProps}
/>
