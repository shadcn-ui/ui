<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { Dialog as DialogPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: DialogPrimitive.TitleProps = $props()
</script>

<DialogPrimitive.Title
  bind:ref
  data-slot="dialog-title"
  class={cn("cn-dialog-title", className)}
  {...restProps}
/>
