<script lang="ts">
  import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte"
  import { Button } from "$lib/registry/ui/button/index.js"
  import { cn, type WithoutChildrenOrChild } from "$lib/utils.js"
  import { Dialog as DialogPrimitive } from "bits-ui"
  import type { ComponentProps, Snippet } from "svelte"

  import DialogPortal from "./dialog-portal.svelte"
  import * as Dialog from "./index.js"

  let {
    ref = $bindable(null),
    class: className,
    portalProps,
    children,
    showCloseButton = true,
    ...restProps
  }: WithoutChildrenOrChild<DialogPrimitive.ContentProps> & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DialogPortal>>
    children: Snippet
    showCloseButton?: boolean
  } = $props()
</script>

<DialogPortal {...portalProps}>
  <Dialog.Overlay />
  <DialogPrimitive.Content
    bind:ref
    data-slot="dialog-content"
    class={cn(
      "cn-dialog-content fixed top-1/2 left-1/2 z-50 w-full -translate-x-1/2 -translate-y-1/2 outline-none",
      className
    )}
    {...restProps}
  >
    {@render children?.()}
    {#if showCloseButton}
      <DialogPrimitive.Close data-slot="dialog-close">
        {#snippet child({ props })}
          <Button
            variant="ghost"
            class="cn-dialog-close"
            size="icon-sm"
            {...props}
          >
            <IconPlaceholder
              lucide="XIcon"
              tabler="IconX"
              hugeicons="Cancel01Icon"
              phosphor="XIcon"
              remixicon="RiCloseLine"
            />
            <span class="sr-only">Close</span>
          </Button>
        {/snippet}
      </DialogPrimitive.Close>
    {/if}
  </DialogPrimitive.Content>
</DialogPortal>
