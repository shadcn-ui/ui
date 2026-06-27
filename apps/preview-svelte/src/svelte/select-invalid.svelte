<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as Select from "@/svelte-ui/select/index.js";

	let value = $state("");

	const triggerContent = $derived(value || "Select a fruit");
</script>

<Field.Field data-invalid class="w-full max-w-48">
	<Field.Label>Fruit</Field.Label>
	<Select.Root type="single" bind:value>
		<Select.Trigger aria-invalid="true">{triggerContent}</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Item value="apple">Apple</Select.Item>
				<Select.Item value="banana">Banana</Select.Item>
				<Select.Item value="blueberry">Blueberry</Select.Item>
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<Field.Error>Please select a fruit.</Field.Error>
</Field.Field>
