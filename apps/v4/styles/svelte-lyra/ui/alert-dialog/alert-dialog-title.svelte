<script lang="ts">
  import { cn } from "$lib/utils.js"
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui"

  let {
    ref = $bindable(null),
    class: className,
    ...restProps
  }: AlertDialogPrimitive.TitleProps = $props()
</script>

<AlertDialogPrimitive.Title
  bind:ref
  data-slot="alert-dialog-title"
  class={cn("cn-alert-dialog-title", className)}
  {...restProps}
/>
