<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const inputGroupVariants = tv({
		base: "group/input-group cn-input-group relative flex w-full min-w-0 items-center outline-none has-[>textarea]:h-auto",
		variants: {
			variant: {
				outline: "cn-input-group-variant-outline", // [FORCE-UI]
				filled: "cn-input-group-variant-filled", // [FORCE-UI]
				underline: "cn-input-group-variant-underline", // [FORCE-UI]
				ghost: "cn-input-group-variant-ghost", // [FORCE-UI]
			},
		},
		defaultVariants: {
			variant: "outline",
		},
	});

	export type InputGroupVariant = VariantProps<typeof inputGroupVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "@/svelte-lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		variant, // [FORCE-UI]
		children,
		...props
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: InputGroupVariant; // [FORCE-UI]
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="input-group"
	role="group"
	class={cn(inputGroupVariants({ variant }), className)}
	{...props}
>
	{@render children?.()}
</div>
