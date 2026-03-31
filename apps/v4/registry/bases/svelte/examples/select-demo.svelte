<script lang="ts">
	import * as Select from "$lib/registry/ui/select/index.js";

	const fruits = [
		{ value: "apple", label: "Apple" },
		{ value: "banana", label: "Banana" },
		{ value: "blueberry", label: "Blueberry" },
		{ value: "grapes", label: "Grapes" },
		{ value: "pineapple", label: "Pineapple" },
	];

	let value = $state("");

	const triggerContent = $derived(
		fruits.find((f) => f.value === value)?.label ?? "Select a fruit"
	);
</script>

<Select.Root type="single" name="favoriteFruit" bind:value>
	<Select.Trigger class="w-[180px]">
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Fruits</Select.Label>
			{#each fruits as fruit (fruit.value)}
				<Select.Item
					value={fruit.value}
					label={fruit.label}
					disabled={fruit.value === "grapes"}
				>
					{fruit.label}
				</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
