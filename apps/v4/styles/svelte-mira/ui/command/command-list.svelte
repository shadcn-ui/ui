<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Command as CommandPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: CommandPrimitive.ListProps = $props()
</script>

<CommandPrimitive.List
  bind:ref
  data-slot="command-list"
  class={cn("cn-command-list overflow-x-hidden overflow-y-auto", className)}
  {...restProps}
/>
