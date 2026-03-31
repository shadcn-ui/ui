<script lang="ts">
  import {
    cn,
    type WithoutChild,
    type WithoutChildrenOrChild,
  } from "$lib/utils.js"
  import { AlertDialog as AlertDialogPrimitive } from "bits-ui"
  import type { ComponentProps } from "svelte"

  import AlertDialogOverlay from "./alert-dialog-overlay.svelte"
  import AlertDialogPortal from "./alert-dialog-portal.svelte"

  let {
    ref = $bindable(null),
    class: className,
    size = "default",
    portalProps,
    ...restProps
  }: WithoutChild<AlertDialogPrimitive.ContentProps> & {
    size?: "default" | "sm"
    portalProps?: WithoutChildrenOrChild<
      ComponentProps<typeof AlertDialogPortal>
    >
  } = $props()
</script>

<AlertDialogPortal {...portalProps}>
  <AlertDialogOverlay />
  <AlertDialogPrimitive.Content
    bind:ref
    data-slot="alert-dialog-content"
    data-size={size}
    class={cn(
      "cn-alert-dialog-content group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 outline-none",
      className
    )}
    {...restProps}
  />
</AlertDialogPortal>
