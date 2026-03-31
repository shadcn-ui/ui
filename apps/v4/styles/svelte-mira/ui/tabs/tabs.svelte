<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Tabs as TabsPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    ...restProps
  }: TabsPrimitive.RootProps = $props()
</script>

<TabsPrimitive.Root
  bind:ref
  bind:value
  data-slot="tabs"
  class={cn(
    "cn-tabs group/tabs flex data-[orientation=horizontal]:flex-col",
    className
  )}
  {...restProps}
/>
