<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLFieldsetAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLFieldsetAttributes> = $props();
</script>

<fieldset
	bind:this={ref}
	data-slot="field-set"
	class={cn("cn-field-set flex flex-col", className)}
	{...restProps}
>
	{@render children?.()}
</fieldset>
