<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Tabs as TabsPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: TabsPrimitive.ContentProps = $props()
</script>

<TabsPrimitive.Content
  bind:ref
  data-slot="tabs-content"
  class={cn("cn-tabs-content flex-1 outline-none", className)}
  {...restProps}
/>
