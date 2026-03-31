<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: NavigationMenuPrimitive.ItemProps = $props()
</script>

<NavigationMenuPrimitive.Item
  bind:ref
  data-slot="navigation-menu-item"
  class={cn("cn-navigation-menu-item relative", className)}
  {...restProps}
/>
