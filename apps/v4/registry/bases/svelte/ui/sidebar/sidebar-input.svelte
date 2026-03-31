<script lang="ts">
	import type { ComponentProps } from "svelte";
	import { Input } from "$lib/registry/ui/input/index.js";
	import { cn } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		value = $bindable(""),
		class: className,
		...restProps
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	bind:ref
	bind:value
	data-slot="sidebar-input"
	data-sidebar="input"
	class={cn("cn-sidebar-input", className)}
	{...restProps}
/>
