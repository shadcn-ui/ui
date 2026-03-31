<script lang="ts">
	import { RadioGroup as RadioGroupPrimitive } from "bits-ui";
	import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte";
	import { cn, type WithoutChildrenOrChild } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithoutChildrenOrChild<RadioGroupPrimitive.ItemProps> = $props();
</script>

<RadioGroupPrimitive.Item
	bind:ref
	data-slot="radio-group-item"
	class={cn(
		"cn-radio-group-item group/radio-group-item peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50",
		className
	)}
	{...restProps}
>
	{#snippet children({ checked })}
		<div data-slot="radio-group-indicator" class="cn-radio-group-indicator">
			{#if checked}
				<IconPlaceholder
					lucide="CircleIcon"
					tabler="IconCircle"
					hugeicons="CircleIcon"
					phosphor="CircleIcon"
					remixicon="RiCircleLine"
					class="cn-radio-group-indicator-icon"
				/>
			{/if}
		</div>
	{/snippet}
</RadioGroupPrimitive.Item>
