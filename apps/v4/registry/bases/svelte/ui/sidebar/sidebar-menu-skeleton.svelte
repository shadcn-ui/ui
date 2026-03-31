<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import { Skeleton } from "$lib/registry/ui/skeleton/index.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		showIcon = false,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		showIcon?: boolean;
	} = $props();

	// Random width between 50% and 90%
	const width = `${Math.floor(Math.random() * 40) + 50}%`;
</script>

<div
	bind:this={ref}
	data-slot="sidebar-menu-skeleton"
	data-sidebar="menu-skeleton"
	class={cn("cn-sidebar-menu-skeleton flex items-center", className)}
	{...restProps}
>
	{#if showIcon}
		<Skeleton class="cn-sidebar-menu-skeleton-icon" data-sidebar="menu-skeleton-icon" />
	{/if}
	<Skeleton
		class="cn-sidebar-menu-skeleton-text max-w-(--skeleton-width) flex-1"
		data-sidebar="menu-skeleton-text"
		style="--skeleton-width: {width};"
	/>
	{@render children?.()}
</div>
