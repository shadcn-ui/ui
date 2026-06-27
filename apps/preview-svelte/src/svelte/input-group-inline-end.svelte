<script lang="ts">
	import * as Field from "@/svelte-ui/field/index.js";
	import * as InputGroup from "@/svelte-ui/input-group/index.js";
	import EyeOffIcon from "~icons/ms/visibility_off";
</script>

<Field.Field class="max-w-sm">
	<Field.Label for="inline-end-input">Input</Field.Label>
	<InputGroup.Root>
		<InputGroup.Input
			id="inline-end-input"
			type="password"
			placeholder="Enter password"
		/>
		<InputGroup.Addon align="inline-end">
			<EyeOffIcon />
		</InputGroup.Addon>
	</InputGroup.Root>
	<Field.Description>Icon positioned at the end.</Field.Description>
</Field.Field>
