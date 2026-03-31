<script lang="ts">
	import { cn } from "@/svelte-lib/utils.js";
	import type { ComponentProps } from "svelte";
	import { Input } from "@/svelte-ui/input/index.js";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Input> = $props();
</script>

<Input
	bind:ref
	data-slot="input-group-control"
	class={cn("cn-input-group-input flex-1", className)}
	bind:value
	{...props}
/>
