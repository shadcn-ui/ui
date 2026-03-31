<script lang="ts">
	import { Command as CommandPrimitive } from "bits-ui";
	import { cn } from "$lib/utils.js";
	import * as InputGroup from "$lib/registry/ui/input-group/index.js";
	import IconPlaceholder from "$lib/components/icon-placeholder/icon-placeholder.svelte";

	let {
		ref = $bindable(null),
		class: className,
		value = $bindable(""),
		...restProps
	}: CommandPrimitive.InputProps = $props();
</script>

<div data-slot="command-input-wrapper" class="cn-command-input-wrapper">
	<InputGroup.Root class="cn-command-input-group">
		<CommandPrimitive.Input
			data-slot="command-input"
			class={cn(
				"cn-command-input outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			bind:ref
			{...restProps}
			bind:value
		/>
		<InputGroup.Addon>
			<IconPlaceholder
				lucide="SearchIcon"
				tabler="IconSearch"
				hugeicons="SearchIcon"
				phosphor="MagnifyingGlassIcon"
				remixicon="RiSearchLine"
				class="cn-command-input-icon"
			/>
		</InputGroup.Addon>
	</InputGroup.Root>
</div>
