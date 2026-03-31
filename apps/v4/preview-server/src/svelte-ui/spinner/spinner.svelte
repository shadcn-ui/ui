<script lang="ts">
	import { cn } from "@/svelte-lib/utils.js";
	import IconPlaceholder from "@/svelte-components/icon-placeholder/icon-placeholder.svelte";
	import type { SVGAttributes } from "svelte/elements";

	let {
		class: className,
		role = "status",
		// we add color and stroke for compatibility with different icon libraries props
		color,
		stroke,
		"aria-label": ariaLabel = "Loading",
		...restProps
	}: SVGAttributes<SVGSVGElement> = $props();
</script>

<IconPlaceholder
	lucide="Loader2Icon"
	tabler="IconLoader"
	hugeicons="Loading03Icon"
	phosphor="SpinnerIcon"
	remixicon="RiLoaderLine"
	{role}
	color={color === null ? undefined : color}
	stroke={stroke === null ? undefined : stroke}
	aria-label={ariaLabel}
	class={cn("size-4 animate-spin", className)}
	{...restProps}
/>
