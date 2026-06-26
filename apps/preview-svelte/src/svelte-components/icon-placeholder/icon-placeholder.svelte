<script lang="ts">
	import type { SVGAttributes } from "svelte/elements";

	import { materialSymbols } from "./material-symbols";

	// [FORCE-UI] Preview defaults to Material Symbols (@material-symbols/svg-400,
	// rounded) resolved from the generated inline registry.
	type Props = {
		lucide?: string;
		tabler?: string;
		hugeicons?: string;
		phosphor?: string;
		remixicon?: string;
		materialSymbols?: string;
		class?: string;
	};

	let {
		class: className,
		materialSymbols: name,
		...restProps
	}: Props & Omit<SVGAttributes<SVGSVGElement>, "class"> = $props();

	const icon = $derived(name ? materialSymbols[name] : undefined);
</script>

{#if icon}
	<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox={icon.viewBox}
		width="1em"
		height="1em"
		fill="currentColor"
		class={className}
		{...restProps as unknown as object}>{@html icon.body}</svg
	>
{/if}
