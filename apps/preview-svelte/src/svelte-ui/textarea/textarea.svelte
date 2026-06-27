<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const textareaVariants = tv({
		base: "cn-textarea placeholder:text-muted-foreground flex field-sizing-content min-h-16 w-full outline-none disabled:cursor-not-allowed disabled:opacity-50",
		variants: {
			variant: {
				outline: "cn-textarea-variant-outline", // [FORCE-UI]
				filled: "cn-textarea-variant-filled", // [FORCE-UI]
				underline: "cn-textarea-variant-underline", // [FORCE-UI]
				ghost: "cn-textarea-variant-ghost", // [FORCE-UI]
			},
		},
		defaultVariants: {
			variant: "outline",
		},
	});

	export type TextareaVariant = VariantProps<typeof textareaVariants>["variant"];
</script>

<script lang="ts">
	import { cn, type WithElementRef, type WithoutChildren } from "@/svelte-lib/utils.js";
	import type { HTMLTextareaAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		variant, // [FORCE-UI]
		"data-slot": dataSlot = "textarea",
		...restProps
	}: WithoutChildren<WithElementRef<HTMLTextareaAttributes>> & {
		variant?: TextareaVariant; // [FORCE-UI]
	} = $props();
</script>

<textarea
	bind:this={ref}
	data-slot={dataSlot}
	class={cn(textareaVariants({ variant }), className)}
	bind:value
	{...restProps}
></textarea>
