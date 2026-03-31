<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { NavigationMenu as NavigationMenuPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: NavigationMenuPrimitive.LinkProps = $props()
</script>

<NavigationMenuPrimitive.Link
  bind:ref
  data-slot="navigation-menu-link"
  class={cn("cn-navigation-menu-link", className)}
  {...restProps}
/>
