<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as RadioGroup from "@/svelte-ui/radio-group/index.js";
</script>

<RadioGroup.Root value="option2" class="w-fit">
	<Field.Field orientation="horizontal" data-disabled>
		<RadioGroup.Item value="option1" id="disabled-1" disabled />
		<Field.Label for="disabled-1" class="font-normal">Disabled</Field.Label>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="option2" id="disabled-2" />
		<Field.Label for="disabled-2" class="font-normal">Option 2</Field.Label>
	</Field.Field>
	<Field.Field orientation="horizontal">
		<RadioGroup.Item value="option3" id="disabled-3" />
		<Field.Label for="disabled-3" class="font-normal">Option 3</Field.Label>
	</Field.Field>
</RadioGroup.Root>
