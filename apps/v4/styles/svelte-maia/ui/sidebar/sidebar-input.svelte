<script lang="ts">
  import { Input } from "$lib/registry/ui/input/index.js"
  import { cn } from "$lib/utils.js"
  import type { ComponentProps } from "svelte"

  let {
    ref = $bindable(null),
    value = $bindable(""),
    class: className,
    ...restProps
  }: ComponentProps<typeof Input> = $props()
</script>

<Input
  bind:ref
  bind:value
  data-slot="sidebar-input"
  data-sidebar="input"
  class={cn("cn-sidebar-input", className)}
  {...restProps}
/>
