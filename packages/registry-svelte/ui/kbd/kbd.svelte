<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  export const kbdVariants = tv({
    base: "cn-kbd pointer-events-none inline-flex items-center justify-center select-none",
    variants: {
      variant: {
        default: "cn-kbd-variant-default",
        primary: "cn-kbd-variant-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  });

  export type KbdVariant = VariantProps<typeof kbdVariants>["variant"];
</script>

<script lang="ts">
  import { cn, type WithElementRef } from "$lib/utils.js";
  import type { HTMLAttributes } from "svelte/elements";

  let {
    ref = $bindable(null),
    class: className,
    variant,
    children,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLElement>> & {
    variant?: KbdVariant;
  } = $props();
</script>

<kbd
  bind:this={ref}
  data-slot="kbd"
  class={cn(kbdVariants({ variant }), className)}
  {...restProps}
>
  {@render children?.()}
</kbd>
