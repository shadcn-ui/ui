<script lang="ts" module>
  import { type VariantProps, tv } from "tailwind-variants";

  export const inputVariants = tv({
    base: "cn-input w-full min-w-0 outline-none file:inline-flex file:border-0 file:bg-transparent file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    variants: {
      variant: {
        outline: "cn-input-variant-outline",
        filled: "cn-input-variant-filled",
        underline: "cn-input-variant-underline",
        ghost: "cn-input-variant-ghost",
      },
    },
    defaultVariants: {
      variant: "outline",
    },
  });

  export type InputVariant = VariantProps<typeof inputVariants>["variant"];
</script>

<script lang="ts">
  import type { HTMLInputAttributes, HTMLInputTypeAttribute } from "svelte/elements";
  import { cn, type WithElementRef } from "$lib/utils.js";

  type InputType = Exclude<HTMLInputTypeAttribute, "file">;

  type Props = WithElementRef<
    Omit<HTMLInputAttributes, "type"> &
      ({ type: "file"; files?: FileList } | { type?: InputType; files?: undefined })
  > & {
    variant?: InputVariant;
  };

  let {
    ref = $bindable(null),
    value = $bindable(),
    type,
    files = $bindable(),
    variant,
    class: className,
    "data-slot": dataSlot = "input",
    ...restProps
  }: Props = $props();
</script>

{#if type === "file"}
  <input
    bind:this={ref}
    data-slot={dataSlot}
    class={cn(inputVariants({ variant }), className)}
    type="file"
    bind:files
    bind:value
    {...restProps}
  />
{:else}
  <input
    bind:this={ref}
    data-slot={dataSlot}
    class={cn(inputVariants({ variant }), className)}
    {type}
    bind:value
    {...restProps}
  />
{/if}
