<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as RadioGroup from "@/svelte-ui/radio-group/index.js";
</script>

<RadioGroup.Root value="comfortable" class="w-fit">
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="default" id="desc-r1" />
		<Field.Content>
			<Field.Label for="desc-r1">Default</Field.Label>
			<Field.Description>Standard spacing for most use cases.</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="comfortable" id="desc-r2" />
		<Field.Content>
			<Field.Label for="desc-r2">Comfortable</Field.Label>
			<Field.Description>More space between elements.</Field.Description>
		</Field.Content>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="compact" id="desc-r3" />
		<Field.Content>
			<Field.Label for="desc-r3">Compact</Field.Label>
			<Field.Description>Minimal spacing for dense layouts.</Field.Description>
		</Field.Content>
	</Field.Field>
</RadioGroup.Root>
