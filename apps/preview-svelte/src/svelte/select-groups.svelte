<script lang="ts">
	import * as Select from "@/svelte-ui/select/index.js";
</script>

<Select.Root type="single">
	<Select.Trigger class="w-full max-w-48">Select a fruit</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Label>Fruits</Select.Label>
			<Select.Item value="apple">Apple</Select.Item>
			<Select.Item value="banana">Banana</Select.Item>
			<Select.Item value="blueberry">Blueberry</Select.Item>
		</Select.Group>
		<Select.Separator />
		<Select.Group>
			<Select.Label>Vegetables</Select.Label>
			<Select.Item value="carrot">Carrot</Select.Item>
			<Select.Item value="broccoli">Broccoli</Select.Item>
			<Select.Item value="spinach">Spinach</Select.Item>
		</Select.Group>
	</Select.Content>
</Select.Root>
