<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Avatar as AvatarPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: AvatarPrimitive.ImageProps = $props()
</script>

<AvatarPrimitive.Image
  bind:ref
  data-slot="avatar-image"
  class={cn("cn-avatar-image aspect-square size-full object-cover", className)}
  {...restProps}
/>
