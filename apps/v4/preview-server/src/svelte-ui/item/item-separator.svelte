<script lang="ts">
	import { Separator } from "@/svelte-ui/separator/index.js";
	import { cn } from "@/svelte-lib/utils.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	bind:ref
	data-slot="item-separator"
	orientation="horizontal"
	class={cn("cn-item-separator", className)}
	{...restProps}
/>
