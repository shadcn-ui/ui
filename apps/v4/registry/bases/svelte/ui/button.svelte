<script lang="ts">
  import { cva, type VariantProps } from "class-variance-authority"
  import type { Snippet } from "svelte"
  import type { HTMLButtonAttributes } from "svelte/elements"
  import { cn } from "@/lib/utils"

  const buttonVariants = cva(
    "cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "cn-button-variant-default",
          outline: "cn-button-variant-outline",
          secondary: "cn-button-variant-secondary",
          ghost: "cn-button-variant-ghost",
          destructive: "cn-button-variant-destructive",
          link: "cn-button-variant-link",
        },
        size: {
          default: "cn-button-size-default",
          xs: "cn-button-size-xs",
          sm: "cn-button-size-sm",
          lg: "cn-button-size-lg",
          icon: "cn-button-size-icon",
          "icon-xs": "cn-button-size-icon-xs",
          "icon-sm": "cn-button-size-icon-sm",
          "icon-lg": "cn-button-size-icon-lg",
        },
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    }
  )

  type ButtonVariants = VariantProps<typeof buttonVariants>

  type Props = HTMLButtonAttributes & {
    variant?: NonNullable<ButtonVariants>["variant"]
    size?: NonNullable<ButtonVariants>["size"]
    children?: Snippet
  }

  let {
    children,
    class: className,
    variant = "default",
    size = "default",
    ...restProps
  }: Props = $props()
</script>

<button
  data-slot="button"
  data-variant={variant}
  data-size={size}
  class={cn(buttonVariants({ variant, size }), className)}
  {...restProps}
>
  {#if children}
    {@render children()}
  {/if}
</button>
