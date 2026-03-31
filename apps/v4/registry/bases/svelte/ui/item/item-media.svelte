<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const itemMediaVariants = tv({
		base: "cn-item-media flex shrink-0 items-center justify-center [&_svg]:pointer-events-none",
		variants: {
			variant: {
				default: "cn-item-media-variant-default",
				icon: "cn-item-media-variant-icon",
				image: "cn-item-media-variant-image",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	});

	export type ItemMediaVariant = VariantProps<typeof itemMediaVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		variant = "default",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { variant?: ItemMediaVariant } = $props();
</script>

<div
	bind:this={ref}
	data-slot="item-media"
	data-variant={variant}
	class={cn(itemMediaVariants({ variant }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
