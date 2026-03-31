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
	data-slot="item-content"
	class={cn(
		"cn-item-content flex flex-1 flex-col [&+[data-slot=item-content]]:flex-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>
