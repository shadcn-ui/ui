<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as Select from "@/svelte-ui/select/index.js";
	import { Switch } from "@/svelte-ui/switch/index.js";

	let alignItemWithTrigger = $state(true);
	let value = $state("banana");

	const triggerContent = $derived(value || "Select a fruit");
</script>

<Field.Group class="w-full max-w-xs">
	<Field.Field orientation="horizontal">
		<Field.Content>
			<Field.Label for="align-item">Align Item</Field.Label>
			<Field.Description>Toggle to align the item with the trigger.</Field.Description>
		</Field.Content>
		<Switch id="align-item" bind:checked={alignItemWithTrigger} />
	</Field.Field>
	<Field.Field>
		<Select.Root type="single" bind:value>
			<Select.Trigger>{triggerContent}</Select.Trigger>
			<Select.Content position={alignItemWithTrigger ? "item-aligned" : "popper"}>
				<Select.Group>
					<Select.Item value="apple">Apple</Select.Item>
					<Select.Item value="banana">Banana</Select.Item>
					<Select.Item value="blueberry">Blueberry</Select.Item>
					<Select.Item value="grapes">Grapes</Select.Item>
					<Select.Item value="pineapple">Pineapple</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</Field.Field>
</Field.Group>
