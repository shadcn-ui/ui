<script lang="ts" module>
	import { type VariantProps, tv } from "tailwind-variants";

	export const spinnerVariants = tv({
		base: "animate-spin",
		variants: {
			size: {
				xs: "cn-spinner-size-xs", // [FORCE-UI]
				sm: "cn-spinner-size-sm", // [FORCE-UI]
				md: "cn-spinner-size-md", // [FORCE-UI]
				lg: "cn-spinner-size-lg", // [FORCE-UI]
			},
		},
		defaultVariants: {
			size: "md",
		},
	});

	export type SpinnerSize = VariantProps<typeof spinnerVariants>["size"];
</script>

<script lang="ts">
	import { cn } from "@/svelte-lib/utils.js";
	import IconPlaceholder from "@/svelte-components/icon-placeholder/icon-placeholder.svelte";
	import type { SVGAttributes } from "svelte/elements";

	let {
		class: className,
		role = "status",
		size, // [FORCE-UI]
		// we add color and stroke for compatibility with different icon libraries props
		color,
		stroke,
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> & {
		size?: SpinnerSize; // [FORCE-UI]
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
	color={color === null ? undefined : color}
	stroke={stroke === null ? undefined : stroke}
	aria-label={ariaLabel}
	class={cn(spinnerVariants({ size }), className)}
	{...restProps}
/>
