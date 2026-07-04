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

<!-- [FORCE-UI] aria-hidden scoped to the icon only — hiding it on the host span
     also hid the sr-only label below, a WCAG 4.1.2 defect -->
<span
	bind:this={ref}
	role="presentation"
	data-slot="pagination-ellipsis"
	class={cn("cn-pagination-ellipsis flex items-center justify-center", className)}
	{...restProps}
>
	<span aria-hidden="true">
		<IconPlaceholder
			lucide="MoreHorizontalIcon"
			materialSymbols="more_horiz"
			tabler="IconDots"
			hugeicons="MoreHorizontalCircle01Icon"
			phosphor="DotsThreeIcon"
			remixicon="RiMoreLine"
		/>
	</span>
	<span class="sr-only">More pages</span>
</span>
