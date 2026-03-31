<script lang="ts">
	import ArrowRight from "@lucide/svelte/icons/arrow-right";
	import { Button } from "$lib/registry/ui/button/index.js";
	import * as ButtonGroup from "$lib/registry/ui/button-group/index.js";
	import { Input } from "$lib/registry/ui/input/index.js";
	import * as Select from "$lib/registry/ui/select/index.js";

	const CURRENCIES = [
		{
			value: "$",
			label: "US Dollar",
		},
		{
			value: "€",
			label: "Euro",
		},
		{
			value: "£",
			label: "British Pound",
		},
	];

	let currency = $state("$");
</script>

<ButtonGroup.Root>
	<ButtonGroup.Root>
		<Select.Root type="single" bind:value={currency}>
			<Select.Trigger class="font-mono">
				{currency}
			</Select.Trigger>
			<Select.Content class="min-w-24">
				{#each CURRENCIES as currencyOption (currencyOption.value)}
					<Select.Item value={currencyOption.value}>
						{currencyOption.value}
						<span class="text-muted-foreground">{currencyOption.label}</span>
					</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
		<Input placeholder="10.00" pattern="[0-9]*" />
	</ButtonGroup.Root>
	<ButtonGroup.Root>
		<Button aria-label="Send" size="icon" variant="outline">
			<ArrowRight />
		</Button>
	</ButtonGroup.Root>
</ButtonGroup.Root>
