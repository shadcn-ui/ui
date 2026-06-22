<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  export const spinnerVariants = tv({
    base: "cn-spinner animate-spin",
    variants: {
      color: {
        default: "cn-spinner-color-default",
        primary: "cn-spinner-color-primary",
        onPrimary: "cn-spinner-color-onPrimary",
        inherit: "cn-spinner-color-inherit",
      },
      size: {
        xs: "cn-spinner-size-xs",
        sm: "cn-spinner-size-sm",
        md: "cn-spinner-size-md",
        lg: "cn-spinner-size-lg",
      },
    },
    defaultVariants: {
      color: "default",
      size: "sm",
    },
  });

  export type SpinnerColor = VariantProps<typeof spinnerVariants>["color"];
  export type SpinnerSize = VariantProps<typeof spinnerVariants>["size"];
</script>

<script lang="ts">
  import { cn } from "$lib/utils.js";
  import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte";
  import type { SVGAttributes } from "svelte/elements";

  let {
    class: className,
    role = "status",
    color,
    "aria-label": ariaLabel = "Loading",
    size,
    ...restProps
  }: SVGAttributes<SVGSVGElement> & {
    color?: SpinnerColor;
    size?: SpinnerSize;
  } = $props();
</script>

<IconPlaceholder
  lucide="Loader2Icon"
		materialSymbols="progress_activity"
  tabler="IconLoader"
  hugeicons="Loading03Icon"
  phosphor="SpinnerIcon"
  remixicon="RiLoaderLine"
  {role}
  aria-label={ariaLabel}
  class={cn(spinnerVariants({ color, size }), className)}
  {...restProps}
/>
