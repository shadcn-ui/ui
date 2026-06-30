<script lang="ts">
	import * as Select from "@/svelte-ui/select/index.js";
</script>

<Select.Root type="single" disabled>
	<Select.Trigger class="w-full max-w-48">Select a fruit</Select.Trigger>
	<Select.Content>
		<Select.Group>
			<Select.Item value="apple">Apple</Select.Item>
			<Select.Item value="banana">Banana</Select.Item>
			<Select.Item value="blueberry">Blueberry</Select.Item>
			<Select.Item value="grapes" disabled>Grapes</Select.Item>
			<Select.Item value="pineapple">Pineapple</Select.Item>
		</Select.Group>
	</Select.Content>
</Select.Root>
