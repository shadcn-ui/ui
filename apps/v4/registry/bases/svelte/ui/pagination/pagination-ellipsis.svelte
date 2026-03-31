<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef, type WithoutChildren } from "$lib/utils.js";
	import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildren<WithElementRef<HTMLAttributes<HTMLSpanElement>>> = $props();
</script>

<span
	bind:this={ref}
	aria-hidden="true"
	data-slot="pagination-ellipsis"
	class={cn("cn-pagination-ellipsis flex items-center justify-center", className)}
	{...restProps}
>
	<IconPlaceholder
		lucide="MoreHorizontalIcon"
		tabler="IconDots"
		hugeicons="MoreHorizontalCircle01Icon"
		phosphor="DotsThreeIcon"
		remixicon="RiMoreLine"
	/>
	<span class="sr-only">More pages</span>
</span>
