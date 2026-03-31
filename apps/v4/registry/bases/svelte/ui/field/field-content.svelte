<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="field-content"
	class={cn("cn-field-content group/field-content flex flex-1 flex-col leading-snug", className)}
	{...restProps}
>
	{@render children?.()}
</div>
