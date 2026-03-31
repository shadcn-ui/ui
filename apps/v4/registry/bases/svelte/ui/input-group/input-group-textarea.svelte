<script lang="ts">
	import { cn } from "$lib/utils.js";
	import { Textarea } from "$lib/registry/ui/textarea/index.js";
	import type { ComponentProps } from "svelte";

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...props
	}: ComponentProps<typeof Textarea> = $props();
</script>

<Textarea
	bind:ref
	data-slot="input-group-control"
	class={cn("cn-input-group-textarea flex-1 resize-none", className)}
	bind:value
	{...props}
/>
